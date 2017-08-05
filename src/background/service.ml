
open Bs_fetch

let make_request url data =
  Js.Promise.(
    fetchWithInit url
      (RequestInit.make
        ~mode:CORS
        ~method_:Post
        ~headers:(HeadersInit.makeWithArray [|("content-type", "application/json")|])
        ~body:(BodyInit.make @@ Js.Json.stringify data)
        ())
    |> then_ Response.json
  )

let to_data url =
  Js.Dict.fromList [("url", Js.Json.string url)]

let fetch_rating url =
  url
  |> to_data
  |> Js.Json.object_
  |> make_request Constants.process_url
