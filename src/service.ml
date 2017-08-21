open Bs_fetch
open Util


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
  |> Promise.then_ (fun response ->
      Response.json response
      |> Promise.map (fun json ->
          if Response.ok response then Result.Ok json
          else Result.Error (Model.error_message_of_json json)
        )
    )



let fetch_rating token url =
  let data =
    [("url", Js.Json.string url)]
    |> Js.Dict.fromList
    |> Js.Json.object_ in
  make_request Post Constants.process_url token (Some data)
  |> Promise.map (Result.map Model.rating_data_obj_of_json)


let fetch_user_data token =
  make_request Get Constants.me_url (Some token) None
  |> Promise.map (Result.map Model.user_obj_of_json)


let submit_vote token (payload : Model.rating_data) =
  let parse_rating (rating : Model.rating) =
    let value = rating.value |> Option.getExn in
    (string_of_int rating.id, Js.Json.parseExn @@ string_of_int value) in
  let ratings =
    payload.ratings
    |> Array.map parse_rating
    |> Js.Dict.fromArray
    |> Js.Json.object_ in
  let data =
    [("article_id", Js.Json.parseExn @@ string_of_int payload.id); ("ratings", ratings)]
    |> Js.Dict.fromList
    |> Js.Json.object_ in
  make_request Post Constants.rate_url (Some token) (Some data)
  |> Promise.map (Result.map (fun _ -> ())) (* Discard result *)
