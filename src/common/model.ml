type token = string

type url = string

(* JS Object types, for use of storing data to Chrome storage *)
type user_obj = <
  id : int;
  name : string;
> Js.t

type rating_obj = <
  id : int;
  slug : string;
  label : string;
  question : string;
  sum : int;
  count : int;
> Js.t

type rating_data_obj = <
  id : int;
  rated : bool option;
  ratings : rating_obj array;
> Js.t


(* OCaml record types, for use in bucklescript-tea *)
type user = {
  id : int;
  name : string;
}

type rating = {
  id : int;
  slug : string;
  label : string;
  question : string;
  sum : int;
  count : int;
}

type rating_data = {
  id : int;
  rated : bool option;
  ratings : rating array;
}


(* Conversion functions : JSON -> JS Object *)

let unsafe_extract_int dict key =
  Js.Dict.unsafeGet dict key
  |> Js.Json.decodeNumber
  |> Js.Option.getExn
  |> int_of_float

let unsafe_extract_string dict key =
  Js.Dict.unsafeGet dict key
  |> Js.Json.decodeString
  |> Js.Option.getExn

let dict_of_json json = json |> Js.Json.decodeObject |> Js.Option.getExn

let rating_obj_of_json json =
  let dict = dict_of_json json in
  [%bs.obj {
    id = unsafe_extract_int dict "id";
    label = unsafe_extract_string dict "label";
    slug = unsafe_extract_string dict "slug";
    question = unsafe_extract_string dict "question";
    sum = unsafe_extract_int dict "sum";
    count = unsafe_extract_int dict "count";
  }]

let rating_data_obj_of_json json =
  let dict = dict_of_json json in
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
      |> Array.map rating_obj_of_json
  }]

let user_obj_of_json json =
  let dict = dict_of_json json in
  [%bs.obj {
    id = unsafe_extract_int dict "id";
    name = unsafe_extract_string dict "name";
  }]

let error_message_of_json json =
  let dict = dict_of_json json in
  unsafe_extract_string dict "message"


(* Conversion functions : JS Object -> OCaml records *)

let rating_of_rating_obj obj = {
  id = obj##id;
  slug = obj##slug;
  label = obj##label;
  question = obj##question;
  sum = obj##sum;
  count = obj##count;
}

let rating_data_of_rating_data_obj obj = {
  id = obj##id;
  rated = obj##rated;
  ratings = obj##ratings |> Array.map rating_of_rating_obj;
}

let user_of_user_obj obj = {
  id = obj##id;
  name = obj##name;
}
