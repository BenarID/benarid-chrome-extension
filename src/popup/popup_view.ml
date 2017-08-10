open Tea.App
open Tea.Html
open Actions


(* -- Model -- *)

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
  model, Tea.Cmd.none


(* -- Cmds -- *)

let initiate_signin () =
  Tea.Cmd.call (fun callbacks ->
    Chrome.Runtime.send_message [%bs.obj { action = SignIn }];
    !callbacks.enqueue SignInInitiated
  )

let submit_vote vote =
  Tea.Cmd.call (fun callbacks ->
    Chrome.Runtime.send_message [%bs.obj { action = SubmitVote; payload = vote }];
    !callbacks.enqueue SubmitVoteInitiated
  )


(* -- Update -- *)

let update model = function
  | ShowForm -> { model with show_form = true }, Tea.Cmd.none
  | HideForm -> { model with show_form = false }, Tea.Cmd.none
  | ClickSignIn -> model, initiate_signin ()
  | _ -> model, Tea.Cmd.none


(* -- View -- *)

let calculate_percentage count divider =
  if divider <= 0 then 0.
  else
    let raw_percentage = 100.0 *. (float_of_int count /. float_of_int divider) in
    raw_percentage *. 100.
    |> int_of_float
    |> float_of_int
    |> (fun p -> p /. 100.)

let get_color percentage =
  if percentage < 50. then "red" else "green"

let render_rating rating =
  let percentage = calculate_percentage rating##sum rating##count in
  div [ class' "benarid-chromeextension-badge-content__rating" ]
    [ div
        [ class' "benarid-chromeextension-badge-content__header" ]
        [ text rating##label
        ; span
            [ class' "benarid-count" ]
            [ text @@ (string_of_int @@ int_of_float percentage) ^ "% "
            ; span
                [ class' "benarid-divider" ]
                [ text @@ "(" ^ (string_of_int rating##count) ^ " votes)" ]
            ]
        ]
    ; div
        [ class' "benarid-chromeextension-badge-content__value" ]
        [ div
            [ class' @@ "benarid-rating-bar benarid-" ^ (get_color percentage)
            ; style "width" ((string_of_int @@ int_of_float percentage) ^ "%")
            ]
            []
        ]
    ]

let render_button model =
  match model.data##rated, model.user with
  | Some true, _ -> div [] []
  | _, Some _user ->
    div
      [ class' "benarid-chromeextension-badge-content__rate-button" ]
      [ button [ onClick ShowForm ] [ text "Nilai artikel ini" ] ]
  | _, _ ->
    div
      [ class' "benarid-chromeextension-badge-content__rate-button" ]
      [ button [ onClick ClickSignIn ] [ text "Login untuk menilai" ] ]

let render_ratings model =
  div
    []
    [ div
        [ class' "benarid-chromeextension-badge-content__ratings" ]
        (* We use rating as array and to_list @@ map here
          since List.map doesn't seem to work? *)
        (Array.to_list @@ Array.map render_rating model.data##rating)
    ; render_button model
    ]

let view (model : model) =
  div []
    [ if model.show_form
        then div [] [] (* TODO: render form *)
        else render_ratings model
    ; div [ class' "benarid-chromeextension-badge-content__loggedin-message" ]
        [ match model.user with (* TODO: render sign in *)
          | Some user ->
            span []
                [ text ("Telah masuk sebagai " ^ user##name ^ ". ")
                ; a [ onClick SignOut ] [ text "Keluar" ]
                ]
          | None -> div [] []
        ]
    ]


(* -- Subscriptions -- *)

let subscriptions _model =
  Tea.Sub.none


(* -- Main -- *)

let main =
  standardProgram {
    init;
    update;
    view;
    subscriptions;
  }
