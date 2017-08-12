open Bs_fetch


let make_headers (token : string option) =
  let content_type = ("content-type", "application/json") in
  match token with
  | None -> [| content_type |]
  | Some t -> [| content_type; ("authorization", "Bearer " ^ t) |]


let make_init method_ token (data : Js.Json.t option) =
  let default_init =
    RequestInit.make
      ~mode:CORS
      ~method_:method_
      ~headers:(HeadersInit.makeWithArray @@ make_headers token) in
  match data with
  | None -> default_init ()
  | Some d -> default_init ~body:(BodyInit.make @@ Js.Json.stringify d) ()


let make_request method_ url token data =
  fetchWithInit url (make_init method_ token data)
  |> Js.Promise.then_ (fun response ->
      Response.json response
      |> Util.Promise.map (fun json ->
          if Response.ok response then Js.Result.Ok json
          else Js.Result.Error (Model.error_message_of_json json)
        )
    )



let fetch_rating token url =
  let data =
    [("url", Js.Json.string url)]
    |> Js.Dict.fromList
    |> Js.Json.object_ in
  make_request Post Constants.process_url token (Some data)
  |> Util.Promise.map (Util.Result.map Model.rating_obj_of_json)


let fetch_user_data token =
  make_request Get Constants.me_url (Some token) None
  |> Util.Promise.map (Util.Result.map Model.user_obj_of_json)
