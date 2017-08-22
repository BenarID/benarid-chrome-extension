(* The background script act as a server that handle events. *)


[@@@bs.config {no_export = no_export}]


open Actions


(* Fetch rating from server. *)
let fetch_and_store_rating ?tab_id url =
  let open Js.Promise in
  let _ =
    Storage.get_token ()
    |> then_ (fun token_opt -> Service.fetch_rating token_opt url)
    |> then_ (function
        (* Got successful response from server *)
        | Js.Result.Ok rating ->
          Storage.set_rating_data url rating
          |> then_ (fun _ ->
              match tab_id with
              | Some id -> Tabs.enable_extension id |> resolve
              | None -> () |> resolve
            )
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

(* Handle sign out query. *)
let do_sign_out () =
  let open Js.Promise in
  let _ =
    all2 (Storage.remove_user (), Storage.remove_token ())
    |> then_ (fun ((), ()) ->
        Message.broadcast [%bs.obj { action = SignOutSuccess }] |> resolve
      ) in
  ()


(* Handle submit vote query. *)
let submit_vote payload =
  let open Js.Promise in
  let _ =
    Storage.get_token_exn ()
    |> then_ (fun token -> Service.submit_vote token payload)
    |> then_ (function
        | Js.Result.Ok _ -> Message.broadcast [%bs.obj { action = SubmitVoteSuccess }] |> resolve
        | Js.Result.Error _ -> Message.broadcast [%bs.obj { action = SubmitVoteFailed }] |> resolve
      )
  in
  Js.log payload


(* Entry point. *)
let _ =
  Tabs.attach_listener (fun tab_id change_info tab ->
      match change_info##status with

      (* On loading, we can already get the url, so fetch now. *)
      | "loading" -> if Js.String.startsWith "http" tab##url then fetch_and_store_rating ~tab_id tab##url

      (* On other state, ignore. *)
      | _ -> ()
    );

  Message.attach_listener (fun msg sender ->
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
