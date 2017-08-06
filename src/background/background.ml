[@@@bs.config {no_export = no_export}]

open Actions

let get_rating_from_storage () =
  Chrome.Storage.Local.get "ratings"

let set_rating_to_storage url ratings (storage_value : Js.Json.t Js.Dict.t) =
  let original_ratings =
    Js.Dict.get storage_value "ratings"
    |> (fun opt ->
      match opt with
      | None -> Js.Dict.empty ()
      | Some d -> Js.Json.decodeObject d |> Js.Option.getExn
    )
  in
  let ratings' =
    original_ratings
    |> Js.Dict.entries
    |> Array.append [| (url, Js.Json.object_ ratings) |]
    |> Js.Dict.fromArray
    |> Js.Json.object_
  in
  let new_value = Js.Dict.fromArray [| ("ratings", ratings') |] in
  Chrome.Storage.Local.set new_value

let fetch_rating tab_id url =
  let open Js.Promise in
  let _ =
    Service.fetch_rating url
    |> then_ (fun response ->
      match response with

      (* Got successful response from server *)
      | Js.Result.Ok response_json ->
        let response_dict = response_json |> Js.Json.decodeObject |> Js.Option.getExn in
        get_rating_from_storage ()
        |> then_ (fun ratings -> set_rating_to_storage url response_dict ratings |> resolve)
        |> then_ (fun _ -> Chrome.PageAction.show tab_id |> resolve)

        (* Log error messages from server *)
      | Js.Result.Error msg -> Js.log msg |> resolve

    )
    |> catch (fun _ -> resolve ()) (* Do nothing on error *)
  in ()

let try_fetch_rating tab_id url =
  if Js.String.startsWith "http" url then fetch_rating tab_id url

let _ =
  Chrome.Tabs.add_updated_listener (fun tab_id change_info tab ->
    match change_info##status with
    | "complete" -> try_fetch_rating tab_id tab##url
    | _ -> ()
  );

  Chrome.Runtime.add_message_listener (fun msg _sender ->
    match msg##action with

    (* Popup asks for rating *)
    | FetchRating ->
      let open Js.Promise in
      let _ =
        get_rating_from_storage ()
        |> then_ (fun storage_value ->
          Chrome.Tabs.query [%bs.obj { active = Js.true_ ; currentWindow = Js.true_ }]
          |> then_ (fun tabs ->
            let tab = Array.get tabs 0 in
            let ratings =
              "ratings"
              |> Js.Dict.unsafeGet storage_value
              |> Js.Json.decodeObject
              |> Js.Option.getExn
            in
            let rating = Js.Dict.unsafeGet ratings tab##url in
            resolve rating
          )
        )
        |> then_ (fun rating ->
          Chrome.Runtime.send_message
            [%bs.obj { action = FetchRatingSuccess; payload = rating }];
          resolve ()
        )
      in ()
    | _ -> ()
  )
