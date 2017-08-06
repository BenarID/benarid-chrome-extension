open Tea.App
open Tea.Html
open Tea.Cmd

type user = <
  id : int;
  name : string;
> Js.t

type rating = <
  id : int;
  label : string;
  question : string;
  sum : int;
  count : int;
  value : int option;
> Js.t

type data = <
  id : int;
  rating : rating array;
  rated : bool option;
> Js.t

type flags = {
  data : data;
  user : user option;
}

type model = {
  data : data;
  user : user option;
  show_form : bool;
}

type msg = Actions.t

let init (flags : flags) =
  let model = {
    data = flags.data;
    user = flags.user;
    show_form = false;
  } in
  model, NoCmd

let update model (_msg : msg) =
  model, NoCmd

let rating_view rating =
  div []
    [ div [] [ text @@ string_of_int rating##id ]
    ; div [] [ text rating##label ]
    ; div [] [ text @@ string_of_int rating##sum ]
    ; div [] [ text @@ string_of_int rating##count ]
    ]

let view (model : model) =
  div []
    (* We use rating as array and to_list @@ map here
       since List.map doesn't seem to work? *)
    (Array.to_list @@ Array.map rating_view model.data##rating)

let subscriptions _model =
  Tea_sub.NoSub

let main =
  standardProgram {
    init;
    update;
    view;
    subscriptions;
  }
