
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


let make_request url data =
  Js.Promise.(
    fetchWithInit url
      (RequestInit.make
        ~mode:CORS
        ~method_:Post
        ~headers:(HeadersInit.makeWithArray [| ("content-type", "application/json") |])
        ~body:(BodyInit.make @@ Js.Json.stringify data)
        ())
    |> then_ (fun response ->
      Response.json response
      |> then_ (fun resp ->
        if Response.ok response then Js.Result.Ok resp |> resolve
        else Js.Result.Error (parse_error_message resp) |> resolve
      )
    )
  )


let to_data url =
  Js.Dict.fromList [("url", Js.Json.string url)]


let fetch_rating url =
  url
  |> to_data
  |> Js.Json.object_
  |> make_request Constants.process_url
