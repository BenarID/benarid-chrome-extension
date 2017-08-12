type user = <
  id : int;
  name : string
> Js.t

type token = string

type url = string

type rating = <
  id : int;
  slug : string;
  label : string;
  question : string;
  sum : int;
  count : int
> Js.t

type rating_data = <
  id : int;
  rated : bool option;
  ratings : rating array
> Js.t

(* Conversion functions *)

let unsafe_extract_int dict key =
  Js.Dict.unsafeGet dict key
  |> Js.Json.decodeNumber
  |> Js.Option.getExn
  |> int_of_float

let unsafe_extract_string dict key =
  Js.Dict.unsafeGet dict key
  |> Js.Json.decodeString
  |> Js.Option.getExn

let rating_obj_of_json json =
  let dict =
    json
    |> Js.Json.decodeObject
    |> Js.Option.getExn in
  [%bs.obj {
    id = unsafe_extract_int dict "id";
    rated =
      Js.Dict.get dict "rated"
      |> Util.Option.bind Js.Json.decodeBoolean
      |> Util.Option.map Js.to_bool;
    ratings =
      Js.Dict.unsafeGet dict "rating"
      |> Js.Json.decodeArray
      |> Js.Option.getExn
      |> Array.map (fun rating ->
          let dict = Js.Json.decodeObject rating |> Js.Option.getExn in
          [%bs.obj {
            id = unsafe_extract_int dict "id";
            label = unsafe_extract_string dict "label";
            slug = unsafe_extract_string dict "slug";
            question = unsafe_extract_string dict "question";
            sum = unsafe_extract_int dict "sum";
            count = unsafe_extract_int dict "count";
          }]
        )
  }]

let user_obj_of_json json =
  let dict =
    json
    |> Js.Json.decodeObject
    |> Js.Option.getExn in
  [%bs.obj {
    id = unsafe_extract_int dict "id";
    name = unsafe_extract_string dict "name";
  }]

let error_message_of_json json =
  let dict =
    json
    |> Js.Json.decodeObject
    |> Js.Option.getExn in
  Js.Dict.unsafeGet dict "message"
  |> Js.Json.decodeString
  |> Js.Option.getExn
