[@@@bs.config {no_export = no_export}]


open Actions


let get_ratings_from_storage () =
  let open Js.Promise in
  Chrome.Storage.Local.get "ratings"
  |> then_ (fun storage_value ->
    Js.Dict.unsafeGet storage_value "ratings" |> Js.Json.decodeObject |> resolve
  )
  (* Get ratings from storage, returns promise. *)


let get_ratings_from_storage_exn () =
  let open Js.Promise in
  get_ratings_from_storage ()
  |> then_ (fun ratings ->
    ratings |> Js.Option.getExn |> resolve
  )
  (* Get ratings from storage, returns promise. Throws exception if not exist. *)


let append_rating_to_storage url ratings =
  let open Js.Promise in
  get_ratings_from_storage ()
  |> then_ (fun opt ->
    match opt with
    | None -> Js.Dict.empty () |> resolve
    | Some d -> d |> resolve
  )
  |> then_ (fun original_ratings ->
    let ratings' =
      original_ratings
      |> Js.Dict.entries
      |> Array.append [| (url, Js.Json.object_ ratings) |]
      |> Js.Dict.fromArray
      |> Js.Json.object_
    in
    let new_value = Js.Dict.fromArray [| ("ratings", ratings') |] in
    Chrome.Storage.Local.set new_value
  )
  (* Append rating to storage, returns promise. *)


let fetch_rating tab_id url =
  let open Js.Promise in
  let _ =
    Service.fetch_rating url
    |> then_ (fun response ->
      match response with

      (* Got successful response from server *)
      | Js.Result.Ok response_json ->
        let rating = response_json |> Js.Json.decodeObject |> Js.Option.getExn in
        append_rating_to_storage url rating
        |> then_ (fun _ -> Chrome.PageAction.show tab_id |> resolve)

        (* Log error messages from server *)
      | Js.Result.Error msg -> Js.log msg |> resolve

    )
    |> catch (fun _ -> resolve ()) (* Do nothing on error *)
  in ()
  (* Fetch rating from server. *)


let answer_rating_query () =
  let open Js.Promise in
  let _ =
    get_ratings_from_storage_exn ()
    |> then_ (fun ratings ->
      (* Query the active tab to get the url.
         Note: It should be okay to query only the active tab, since this
         function will only be called when the popup is open and the popup
         can only be opened by the current active tab. *)
      Chrome.Tabs.query [%bs.obj { active = true ; currentWindow = true }]
      |> then_ (fun tabs ->
        let tab = Array.get tabs 0 in
        let rating = Js.Dict.unsafeGet ratings tab##url in
        resolve rating
      )
    )
    |> then_ (fun rating ->
      (* Send rating message back to requester. *)
      Chrome.Runtime.send_message [%bs.obj { action = FetchRatingSuccess; payload = rating }];
      resolve ()
    )
  in ()
  (* Answer the query of rating from popup with the value from storage. *)


(* The background script act as a server that handle events.
   Here we attach listeners to both Tabs and Runtime of Chrome. *)
let _ =
  Chrome.Tabs.add_updated_listener (fun tab_id change_info tab ->
    match change_info##status with

    (* On loading, we can already get the url, so fetch now. *)
    | "loading" -> if Js.String.startsWith "http" tab##url then fetch_rating tab_id tab##url

    (* On other state, ignore. *)
    | _ -> ()
  );

  Chrome.Runtime.add_message_listener (fun msg _sender ->
    match msg##action with

    (* Popup asks for rating. *)
    | FetchRating -> answer_rating_query ()

    (* Unrecognized action, ignore. *)
    | _ -> ()
  )
