[@@@bs.config {no_export = no_export}]

(* Code behind the extension's popup interface. This file handles
 * rendering the popup as well as passing data between the TEA app
 * and background.
 *)

open Actions

type dom
external dom : dom = "document" [@@bs.val]
external get_element_by_id : dom -> string -> 'a = "getElementById" [@@bs.send]

let id = "benarid-chromeextension-approot"

let render_popup data =
  let root = get_element_by_id dom id in
  let _app = Popup_view.main root { data = data; user = None } in
  ()

let init () =
  Chrome.Runtime.add_message_listener (fun msg _sender ->
    match msg##action with
    | FetchRatingSuccess -> render_popup msg##payload
    | _ -> ()
  );

  (* Ask for rating from background. *)
  Chrome.Runtime.send_message
    [%bs.obj { action = FetchRating }]

let _ =
  init ()
