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
let render_popup data =
  let root = get_element_by_id dom "benarid-chromeextension-approot" in
  app := Popup_view.main root { data = data; user = None }


(* Entry point. *)
let _ =
  Chrome.Runtime.add_message_listener (fun msg _sender ->
    match msg##action with

    (* Only render popup if fetch rating is successful. *)
    | FetchRatingSuccess -> render_popup msg##payload

    (* Unrecognized action, ignore. *)
    | _ -> ()
  );

  (* Ask for rating from background. *)
  Chrome.Runtime.send_message
    [%bs.obj { action = FetchRating }]
