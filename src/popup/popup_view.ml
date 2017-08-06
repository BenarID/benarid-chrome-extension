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

let calculate_percentage count divider =
  if divider <= 0 then 0.0
  else
    let raw_percentage = 100.0 *. (float_of_int count /. float_of_int divider) in
    raw_percentage *. 100.0
    |> int_of_float
    |> float_of_int
    |> (fun p -> p /. 100.0)

let get_color percentage =
  if percentage < 50.0 then
    "red"
  else
    "green"

let render_rating rating =
  let percentage = calculate_percentage rating##sum rating##count in
  div [ class' "benarid-chromeextension-badge-content__rating" ]
    [ div
        [ class' "benarid-chromeextension-badge-content__header" ]
        [ text rating##label
        ; span
            [ class' "benarid-count" ]
            [ text @@ (string_of_float percentage) ^ "% "
            ; span
                [ class' "benarid-divider" ]
                [ text @@ "(" ^ (string_of_int rating##count) ^ " votes)"]
            ]
        ]
    ; div
        [ class' "benarid-chromeextension-badge-content__value" ]
        [ div
            [ class' @@ "benarid-rating-bar benarid-" ^ (get_color percentage)
            ; style "width" ((string_of_float percentage) ^ "%")
            ]
            []
        ]
    ]

let render_ratings ratings =
  div [ class' "benarid-chromeextension-badge-content__ratings" ]
    (* We use rating as array and to_list @@ map here
       since List.map doesn't seem to work? *)
    (Array.to_list @@ Array.map render_rating ratings)

let view (model : model) =
  div []
    [ match model.show_form with
      | false -> render_ratings model.data##rating
      | true -> div [] []
    ; div [ class' "benarid-chromeextension-badge-content__loggedin-message" ]
        [ match model.user with
          | Some _user -> div [] []
          | None -> div [] []
        ]
    ]


let subscriptions _model =
  Tea_sub.NoSub

let main =
  standardProgram {
    init;
    update;
    view;
    subscriptions;
  }
