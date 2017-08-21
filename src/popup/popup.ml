(* Code behind the extension's popup interface. This file handles
   rendering the popup as well as passing data between the TEA app
   and background. *)


[@@@bs.config {no_export = no_export}]


open Actions

type dom
external dom : dom = "document" [@@bs.val]
external get_element_by_id : dom -> string -> 'a = "getElementById" [@@bs.send]

(* Placeholder for bucklescript-tea app reference *)
[%%bs.raw {|
var app = [];
|}]

type app = Actions.t Tea.App.programInterface
external app : app ref = "" [@@bs.val]
external push_msg : app -> Actions.t -> unit = "pushMsg" [@@bs.send]


(* Render popupview. *)
let render_popup payload =
  let root = get_element_by_id dom "benarid-chromeextension-approot" in
  app := Popup_view.main root { data = payload##rating_data; user = payload##user }


(* Entry point. *)
let _ =
  Message.attach_listener (fun msg _sender ->
      match msg##action with

      (* Only render popup if fetch data is successful. *)
      | FetchDataSuccess -> render_popup msg##payload

      (* Pass notifications to tea app. *)
      | SubmitVoteSuccess | SubmitVoteFailed | SignOutSuccess ->
        push_msg !app msg##action

      (* Unrecognized action, ignore. *)
      | _ -> ()
    );

  (* Ask for rating from background. *)
  Message.broadcast [%bs.obj { action = FetchData }]
