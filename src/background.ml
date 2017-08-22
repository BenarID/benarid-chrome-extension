(* The background script act as a server that handle events. *)


[@@@bs.config {no_export = no_export}]


open Actions
open Util


let execute_and_discard_result fn =
  let _ = fn () in ()


(* Fetch rating from server. *)
let fetch_and_store_rating tab_id url =
  Storage.get_token ()
  |> Promise.then_ (fun token_opt -> Service.fetch_rating token_opt url)
  |> Promise.then_ (function
      (* Got successful response from server *)
      | Result.Ok rating_data ->
        Storage.set_rating_data (string_of_int tab_id) [%bs.obj { url; rating_data }]
        |> Promise.map (fun _ -> Tabs.enable_extension tab_id)
      (* Log error messages from server *)
      | Result.Error msg -> print_endline msg |> Promise.resolve
    )


(* To refetch and store rating after submit vote or sign in/out. *)
let refetch_rating () =
  Tabs.get_active_tab ()
  |> Promise.then_ (fun tab ->
      Storage.get_rating_data_exn (string_of_int tab##id)
      |> Promise.map (fun rating_storage ->
          fetch_and_store_rating tab##id rating_storage##url
        )
    )


(* Answer the query of rating from popup with the value from storage. *)
let answer_popup_data_query () =
  Tabs.get_active_tab ()
  |> Promise.then_ (fun tab ->
      let rating_data_promise = Storage.get_rating_data_exn (string_of_int tab##id) in
      let user_promise = Storage.get_user () in
      Promise.all2 (rating_data_promise, user_promise)
    )
  |> Promise.map (fun (rating_data_obj, user_obj) ->
      (* Send rating message back to requester. *)
      let ratings' = Model.rating_data_of_rating_data_obj rating_data_obj##rating_data in
      let user' = Option.map Model.user_of_user_obj user_obj in
      Message.broadcast [%bs.obj {
        action = FetchDataSuccess;
        payload = {
          rating_data = ratings';
          user = user';
        };
      }]
    )


(* Process token from tab url, store the token to storage, and close the tab. *)
let process_sign_in_token tab =
  let token =
    let get_first a = Array.get a 1 in
    tab##url
    |> Js.String.split "#" |> get_first
    |> Js.String.split "=" |> get_first in
  Service.fetch_user_data token
  |> Promise.map (function
      (* Got successful response from server. *)
      | Result.Ok user ->
        execute_and_discard_result (fun () ->
            Promise.all2 (Storage.set_user user,
                          Storage.set_token token)
          )
      (* Log error message from server *)
      | Result.Error msg -> print_endline msg
    )
  |> Promise.then_ (fun () -> Tabs.remove_tab tab##id)
  |> Promise.map (fun () ->
      (* Wait for 500ms here to make sure that the signin
         popup is already closed. *)
      Js.Global.setTimeout (fun () ->
          execute_and_discard_result refetch_rating
        ) 500
    )


(* Check for successful sign in. *)
let check_for_successful_sign_in () =
  Tabs.get_all_tabs ()
  |> Promise.map (
    Array.iter (fun tab ->
        if Js.String.includes Constants.retrieve_url tab##url then (
          execute_and_discard_result (fun () ->
              process_sign_in_token tab
            )
        )
      )
  )


(* Handle sign in query. *)
let do_sign_in () =
  Tabs.open_auth_popup ();
  Tabs.attach_listener (fun _ _ _ ->
      execute_and_discard_result check_for_successful_sign_in
    )


(* Handle sign out query. *)
let do_sign_out () =
  Promise.all2 (Storage.remove_user (), Storage.remove_token ())
  |> Promise.map (fun _ ->
      Message.broadcast [%bs.obj { action = SignOutSuccess }]
    )
  |> Promise.map (fun () -> refetch_rating ())


(* Handle submit vote query. *)
let submit_vote payload =
  Storage.get_token_exn ()
  |> Promise.then_ (fun token -> Service.submit_vote token payload)
  |> Promise.map (function
      | Result.Ok _ -> Message.broadcast [%bs.obj { action = SubmitVoteSuccess }]
      | Result.Error _ -> Message.broadcast [%bs.obj { action = SubmitVoteFailed }]
    )
  |> Promise.map (fun () -> refetch_rating ())


(* Entry point. *)
let _ =
  Tabs.attach_listener (fun tab_id change_info tab ->
      match change_info##status with

      (* On loading, we can already get the url, so fetch now. *)
      | "loading" -> if Js.String.startsWith "http" tab##url then (
          execute_and_discard_result (fun () ->
              fetch_and_store_rating tab_id tab##url
            )
        )

      (* On other state, ignore. *)
      | _ -> ()
    );

  Message.attach_listener (fun msg _sender ->
      match msg##action with

      (* Popup asks for data. *)
      | FetchData ->
        print_endline "Received FetchData";
        execute_and_discard_result answer_popup_data_query

      (* Popup asks to sign in. *)
      | SignIn ->
        print_endline "Received SignIn";
        execute_and_discard_result do_sign_in

      (* Popup asks to sign out. *)
      | SignOut ->
        print_endline "Received SignOut";
        execute_and_discard_result do_sign_out

      (* Popup asks to submit vote *)
      | SubmitVote ->
        print_endline "Received SubmitVote";
        execute_and_discard_result (fun () -> submit_vote msg##payload)

      (* Unrecognized action, ignore. *)
      | _ -> ()
    )
