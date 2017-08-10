(* The background script act as a server that handle events. *)


[@@@bs.config {no_export = no_export}]


open Actions

(* Storage related functions *)
let get_from_storage get_fn key decode_fn =
  let open Js.Promise in
  get_fn key
  |> then_ (fun storage_value ->
      Js.Dict.unsafeGet storage_value key |> decode_fn |> resolve
    )
let get_from_local_storage key decode_fn =
  get_from_storage Chrome.Storage.Local.get key decode_fn
let get_from_sync_storage key decode_fn =
  get_from_storage Chrome.Storage.Sync.get key decode_fn


(* Get ratings from storage, returns promise. *)
let get_ratings_from_storage () =
  get_from_local_storage "ratings" Js.Json.decodeObject


(* Get ratings from storage, returns promise. Throws exception if not exist. *)
let get_ratings_from_storage_exn () =
  let open Js.Promise in
  get_ratings_from_storage ()
  |> then_ (fun ratings ->
      ratings |> Js.Option.getExn |> resolve
    )


(* Get token from storage, returns promise. *)
let get_token_from_storage () =
  get_from_sync_storage "token" Js.Json.decodeString


(* Get user from storage, returns promise. *)
let get_user_from_storage () =
  get_from_sync_storage "user" Js.Json.decodeObject


(* Append rating to storage, returns promise. *)
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


(* Fetch rating from server. *)
let fetch_rating tab_id url =
  let open Js.Promise in
  let _ =
    get_token_from_storage ()
    |> then_ (fun token -> Service.fetch_rating token url)
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


(* Answer the query of rating from popup with the value from storage. *)
let answer_popup_data_query () =
  let open Js.Promise in
  let _ =
    all2 (get_ratings_from_storage_exn (), get_user_from_storage ())
    |> then_ (fun (ratings, user) ->
        Js.log user;
        (* Query the active tab to get the url.
           Note: It should be okay to query only the active tab, since this
           function will only be called when the popup is open and the popup
           can only be opened by the current active tab. *)
        Chrome.Tabs.query [%bs.obj { active = Js.true_ ; currentWindow = Js.true_ }]
        |> then_ (fun tabs ->
            let tab = Array.get tabs 0 in
            let rating = Js.Dict.unsafeGet ratings tab##url in
            resolve (rating, user)
          )
      )
    |> then_ (fun (rating, user) ->
        (* Send rating message back to requester. *)
        Chrome.Runtime.send_message [%bs.obj {
          action = FetchDataSuccess;
          payload = { rating; user }
        }];
        resolve ()
      )
  in ()


(* Process token from tab url, store the token to storage, and close the tab. *)
let process_sign_in_token tab =
  let open Js.Promise in
  let get_element_at i a = Array.get a i in
  let token =
    tab##url
    |> Js.String.split "#"
    |> get_element_at 1
    |> Js.String.split "="
    |> get_element_at 1
  in
  let _ =
    Service.fetch_user_data token
    |> then_ (fun response ->
        match response with

        | Js.Result.Ok response_json ->
          let payload = Js.Dict.fromArray [| ("token", Js.Json.string token); ("user", response_json) |] in
          let _ = Chrome.Storage.Sync.set payload in
          resolve ()

        | Js.Result.Error msg -> Js.log msg |> resolve
      )
  in
  Chrome.Tabs.remove tab##id


(* Check if sign in fulfilled on one of the opened tabs. *)
let check_sign_in_token () =
  let open Js.Promise in
  let _ =
    Chrome.Tabs.query (Js.Obj.empty ())
    |> then_ (fun tabs ->
        tabs |> Array.iter (fun tab ->
            if Js.String.includes Constants.retrieve_url tab##url then process_sign_in_token tab
          ) |> resolve
      )
  in ()


(* Handle sign in query. *)
let do_sign_in () =
  let window_props = [%bs.obj { url = Constants.signin_url; height = 500; width = 600; _type = "popup" }] in
  let _ = Chrome.Windows.create window_props in
  Chrome.Tabs.add_updated_listener (fun _ _ _ -> check_sign_in_token ())


(* Entry point. *)
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

      (* Popup asks for data. *)
      | FetchData ->
        Js.log "Received FetchData";
        answer_popup_data_query ()

      (* Popup asks to sign in. *)
      | SignIn ->
        Js.log "Received SignIn";
        do_sign_in ()

      (* Unrecognized action, ignore. *)
      | _ -> ()
    )
