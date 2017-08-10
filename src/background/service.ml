
open Bs_fetch


let parse_error_message response =
  let resp_obj =
    response
    |> Js.Json.decodeObject
    |> Js.Option.getExn
  in
  "message"
  |> Js.Dict.unsafeGet resp_obj
  |> Js.Json.decodeString
  |> Js.Option.getExn


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
      ~headers:(HeadersInit.makeWithArray @@ make_headers token)
  in
  match data with
  | None -> default_init ()
  | Some d -> default_init ~body:(BodyInit.make @@ Js.Json.stringify d) ()



let make_request method_ url token data =
  Js.Promise.(
    fetchWithInit url (make_init method_ token data)
    |> then_ (fun response ->
      Response.json response
      |> then_ (fun resp ->
        if Response.ok response then Js.Result.Ok resp |> resolve
        else Js.Result.Error (parse_error_message resp) |> resolve
      )
    )
  )


let fetch_rating token url =
  let data =
    [("url", Js.Json.string url)]
    |> Js.Dict.fromList
    |> Js.Json.object_
  in
  make_request Post Constants.process_url token (Some data)


let fetch_user_data token =
  make_request Get Constants.me_url (Some token) None
