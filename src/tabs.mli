type id = int

val open_auth_popup : unit -> unit

val get_all_tabs : unit -> < .. > Js.t array Js.Promise.t

val get_active_tab : unit -> < .. > Js.t Js.Promise.t

val remove_tab : id -> unit Js.Promise.t

val enable_extension : id -> unit

val attach_listener : (id -> < status : string; .. > Js.t -> < .. > Js.t -> unit) -> unit
