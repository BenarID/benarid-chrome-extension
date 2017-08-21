(* The background script act as a server that handle events. *)


[@@@bs.config {no_export = no_export}]


open Actions
open Util


(* Fetch rating from server. *)
let refetch_rating tab_id url =
  let _ =
    Storage.get_token ()
    |> Promise.then_ (fun token_opt -> Service.fetch_rating token_opt url)
    |> Promise.then_ (function
        (* Got successful response from server *)
        | Result.Ok rating_data ->
          Storage.set_rating_data (string_of_int tab_id) [%bs.obj { url; rating_data }]
          |> Promise.map (fun _ -> Tabs.enable_extension tab_id)
        (* Log error messages from server *)
        | Result.Error msg -> Js.log msg |> Promise.resolve
      )
  in ()


(* To refetch and store rating after submit vote or sign in/out. *)
let refetch_and_store_rating () =
  let _ =
    Tabs.get_active_tab ()
    |> Promise.then_ (fun tab ->
        Storage.get_rating_data_exn (string_of_int tab##id)
        |> Promise.map (fun rating_storage ->
            refetch_rating tab##id rating_storage##url
          )
      )
  in ()


(* Answer the query of rating from popup with the value from storage. *)
let answer_popup_data_query () =
  let _ =
    Tabs.get_active_tab ()
    |> Promise.then_ (fun tab ->
        let rating_storage_promise = Storage.get_rating_data_exn (string_of_int tab##id) in
        let user_promise = Storage.get_user () in
        Promise.all2 (rating_storage_promise, user_promise)
      )
    |> Promise.map (fun (rating_storage, user) ->
        (* Send rating message back to requester. *)
        let ratings' = Model.rating_data_of_rating_data_obj rating_storage##rating_data in
        let user' = Option.map Model.user_of_user_obj user in
        Message.broadcast [%bs.obj {
          action = FetchDataSuccess;
          payload = {
            rating_data = ratings';
            user = user';
          };
        }]
      ) in
  ()


(* Process token from tab url, store the token to storage, and close the tab. *)
let process_sign_in_token tab =
  let token =
    let get_first a = Array.get a 1 in
    tab##url |> Js.String.split "#" |> get_first |> Js.String.split "=" |> get_first in
  let _ =
    Service.fetch_user_data token
    |> Promise.then_ (function
        | Result.Ok user ->
          let _ = Promise.all2 (Storage.set_user user, Storage.set_token token) in
          Promise.resolve ()
        | Result.Error msg -> Js.log msg |> Promise.resolve
      )
    |> Promise.then_ (fun () -> Tabs.remove_tab tab##id)
    |> Promise.map (fun () ->
        (* Wait for 500ms here to make sure that the signin
           popup is already closed. *)
        Js.Global.setTimeout (fun () ->
            refetch_and_store_rating ()
          ) 500
      ) in
  ()


(* Handle sign in query. *)
let do_sign_in () =
  Tabs.open_auth_popup ();
  Tabs.attach_listener (fun _ _ _ ->
      let _ =
        Tabs.get_all_tabs ()
        |> Promise.map (
          Array.iter (fun tab ->
              let is_retrieve_url url =
                Js.String.includes Constants.retrieve_url url in
              if is_retrieve_url tab##url then process_sign_in_token tab
            )
        ) in
      ()
    )

(* Handle sign out query. *)
let do_sign_out () =
  let _ =
    Promise.all2 (Storage.remove_user (), Storage.remove_token ())
    |> Promise.map (fun ((), ()) ->
        Message.broadcast [%bs.obj { action = SignOutSuccess }]
      )
    |> Promise.map (fun () -> refetch_and_store_rating ())
  in ()


(* Handle submit vote query. *)
let submit_vote payload =
  let _ =
    Storage.get_token_exn ()
    |> Promise.then_ (fun token -> Service.submit_vote token payload)
    |> Promise.map (function
        | Result.Ok _ -> Message.broadcast [%bs.obj { action = SubmitVoteSuccess }]
        | Result.Error _ -> Message.broadcast [%bs.obj { action = SubmitVoteFailed }]
      )
    |> Promise.map (fun () -> refetch_and_store_rating ())
  in
  Js.log payload


(* Entry point. *)
let _ =
  Tabs.attach_listener (fun tab_id change_info tab ->
      match change_info##status with

      (* On loading, we can already get the url, so fetch now. *)
      | "loading" -> if Js.String.startsWith "http" tab##url then refetch_rating tab_id tab##url

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

      (* Popup asks to sign out. *)
      | SignOut ->
        Js.log "Received SignOut";
        do_sign_out ()

      (* Popup asks to submit vote *)
      | SubmitVote ->
        Js.log "Received SubmitVote";
        submit_vote msg##payload

      (* Unrecognized action, ignore. *)
      | _ -> ()
    )
