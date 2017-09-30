val fetch_rating : Model.token option -> Model.url -> (Model.rating_data_obj, string) Js.Result.t Js.Promise.t

val fetch_user_data : Model.token -> (Model.user_obj, string) Js.Result.t Js.Promise.t

val submit_vote : Model.token -> Model.rating_data -> (unit, string) Js.Result.t Js.Promise.t

val logout : Model.token -> (unit, string) Js.Result.t Js.Promise.t
