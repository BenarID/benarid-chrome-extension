(* The background script act as a server that handle events. *)


[@@@bs.config {no_export = no_export}]


open Actions


(* Fetch rating from server. *)
let fetch_and_store_rating tab_id url =
  let open Js.Promise in
  let _ =
    Storage.get_token ()
    |> then_ (fun token -> Service.fetch_rating token url)
    |> then_ (function
        (* Got successful response from server *)
        | Js.Result.Ok rating ->
          Storage.set_rating_data url rating
          |> then_ (fun _ -> Tabs.enable_extension tab_id |> resolve)
        (* Log error messages from server *)
        | Js.Result.Error msg -> Js.log msg |> resolve
      )
    |> catch (fun _ -> resolve ()) (* Do nothing on error *)
  in ()


(* Answer the query of rating from popup with the value from storage. *)
let answer_popup_data_query () =
  let open Js.Promise in
  let _ =
    Tabs.get_active_tab ()
    |> then_ (fun tab ->
        let rating_promise = Storage.get_rating_data_exn tab##url in
        let user_promise = Storage.get_user () in
        all2 (rating_promise, user_promise)
      )
    |> then_ (fun (ratings, user) ->
        (* Send rating message back to requester. *)
        let ratings' = Model.rating_data_of_rating_data_obj ratings in
        let user' = Util.Option.map Model.user_of_user_obj user in
        Message.broadcast [%bs.obj {
          action = FetchDataSuccess;
          payload = {
            rating_data = ratings';
            user = user';
          };
        }]
        |> resolve
      ) in
  ()


(* Process token from tab url, store the token to storage, and close the tab. *)
let process_sign_in_token tab =
  let open Js.Promise in
  let token =
    let get_first a = Array.get a 1 in
    tab##url |> Js.String.split "#" |> get_first |> Js.String.split "=" |> get_first in
  let _ =
    Service.fetch_user_data token
    |> then_ (function
        | Js.Result.Ok user ->
          let _ = all2 (Storage.set_user user, Storage.set_token token) in
          resolve ()
        | Js.Result.Error msg -> Js.log msg |> resolve
      )
  in
  Tabs.remove_tab tab##id


(* Handle sign in query. *)
let do_sign_in () =
  Tabs.open_auth_popup ();
  Tabs.attach_listener (fun _ _ _ ->
      let _ =
        Tabs.get_all_tabs ()
        |> Util.Promise.map (
          Array.iter (fun tab ->
              let is_retrieve_url url =
                Js.String.includes Constants.retrieve_url url in
              if is_retrieve_url tab##url then process_sign_in_token tab
            )
        ) in
      ()
    )


(* Entry point. *)
let _ =
  Tabs.attach_listener (fun tab_id change_info tab ->
      match change_info##status with

      (* On loading, we can already get the url, so fetch now. *)
      | "loading" -> if Js.String.startsWith "http" tab##url then fetch_and_store_rating tab_id tab##url

      (* On other state, ignore. *)
      | _ -> ()
    );

  Message.attach_listener (fun msg _sender ->
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
