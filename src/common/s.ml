module type Message = sig
  val broadcast : < .. > Js.t -> unit
  val attach_listener : (< .. > Js.t -> < .. > Js.t -> unit) -> unit
end

module type Service = sig
  val fetch_rating : Model.token option -> Model.url -> (Model.rating_data_obj, string) Js.Result.t Js.Promise.t
  val fetch_user_data : Model.token -> (Model.user_obj, string) Js.Result.t Js.Promise.t
  val submit_vote : Model.token -> Model.rating_data -> (unit, string) Js.Result.t Js.Promise.t
end

module type Storage = sig
  val get_user : unit -> Model.user_obj option Js.Promise.t
  val set_user : Model.user_obj -> unit Js.Promise.t
  val remove_user : unit -> unit Js.Promise.t
  val get_token : unit -> Model.token option Js.Promise.t
  val get_token_exn : unit -> Model.token Js.Promise.t
  val set_token : Model.token -> unit Js.Promise.t
  val remove_token : unit -> unit Js.Promise.t
  val get_rating_data : Model.rating_storage_key -> Model.rating_storage_obj option Js.Promise.t
  val get_rating_data_exn : Model.rating_storage_key -> Model.rating_storage_obj Js.Promise.t
  val set_rating_data : Model.rating_storage_key -> Model.rating_storage_obj -> unit Js.Promise.t
end

module type Tabs = sig
  type id = int
  val open_auth_popup : unit -> unit
  val get_all_tabs : unit -> < .. > Js.t array Js.Promise.t
  val get_active_tab : unit -> < .. > Js.t Js.Promise.t
  val remove_tab : id -> unit Js.Promise.t
  val enable_extension : id -> unit
  val attach_listener : (id -> < status : string; .. > Js.t -> < .. > Js.t -> unit) -> unit
end
