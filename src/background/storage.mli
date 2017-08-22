val get_user : unit -> Model.user_obj option Js.Promise.t
val set_user : Model.user_obj -> unit Js.Promise.t
val remove_user : unit -> unit Js.Promise.t

val get_token : unit -> Model.token option Js.Promise.t
val get_token_exn : unit -> Model.token Js.Promise.t
val set_token : Model.token -> unit Js.Promise.t
val remove_token : unit -> unit Js.Promise.t

val get_rating_data : Model.url -> Model.rating_data_obj option Js.Promise.t
val get_rating_data_exn : Model.url -> Model.rating_data_obj Js.Promise.t
val set_rating_data : Model.url -> Model.rating_data_obj -> unit Js.Promise.t
