open Tea.App
open Tea.Html
open Actions


(* -- Model -- *)

type user = Model.user
type rating = Model.rating
type data = Model.rating_data

type flags = {
  data : data;
  user : user option;
}

type model = {
  data : data;
  user : user option;
  show_form : bool;
  is_submitting_vote : bool;
}

type msg = Actions.t

let should_show_form (flags : flags) =
  match flags.data.rated, flags.user with
  | Some true, _ -> false
  | _, Some _user -> true
  | _, _ -> false

let init (flags : flags) =
  let model = {
    data = flags.data;
    user = flags.user;
    show_form = should_show_form flags;
    is_submitting_vote = false;
  } in
  model, Tea.Cmd.none


(* -- Cmds -- *)

let initiate_signin () =
  Tea.Cmd.call (fun callbacks ->
      Message.broadcast [%bs.obj { action = SignIn }];
      !callbacks.enqueue SignInInitiated
    )

let initiate_signout () =
  Tea.Cmd.call (fun callbacks ->
      Message.broadcast [%bs.obj { action = SignOut }];
      !callbacks.enqueue SignInInitiated
    )

let submit_vote (data : data) =
  Tea.Cmd.call (fun callbacks ->
      Message.broadcast [%bs.obj { action = SubmitVote; payload = data }];
      !callbacks.enqueue SubmitVoteInitiated
    )


(* -- Update -- *)

let merge_rating_with_value (rating : rating) =
  match rating.value with
  | Some value -> { rating with sum = rating.sum + value; count = rating.count + 1 }
  | None -> rating

let set_rating_value rating_id value (rating : rating) =
  if rating_id = rating.id then
    { rating with value = Some value }
  else rating

let update model = function

  | ShowForm ->
    { model with show_form = true }, Tea.Cmd.none

  | HideForm ->
    { model with show_form = false }, Tea.Cmd.none

  | ClickSignIn ->
    model, initiate_signin ()

  | ClickSignOut ->
    model, initiate_signout ()

  | SignOutSuccess ->
    let data = model.data in
    { model with
      user = None;
      data = { data with rated = None };
    }, Tea.Cmd.none

  | Vote (rating_id, value) ->
    let data = model.data in
    let ratings = Array.map (set_rating_value rating_id value) data.ratings in
    { model with data = { data with ratings = ratings } }, Tea.Cmd.none

  | SubmitVote ->
    { model with is_submitting_vote = true }, submit_vote model.data

  | SubmitVoteSuccess ->
    let data = model.data in
    let updated_ratings = Array.map merge_rating_with_value data.ratings in
    { model with
      is_submitting_vote = false;
      show_form = false;
      data = { data with
               ratings = updated_ratings;
               rated = Some true;
             };
    }, Tea.Cmd.none

  | SubmitVoteFailed ->
    { model with is_submitting_vote = false }, Tea.Cmd.none

  | _ ->
    model, Tea.Cmd.none


(* -- View -- *)

let render_submission_button (model : model) =
  if model.is_submitting_vote then
    div
      [ class' "benarid-chromeextension-badge-content__rate-button" ]
      [ button [ class' "button-secondary" ] [ text "Mengirim..." ] ]
  else
    div
      [ class' "benarid-chromeextension-badge-content__rate-button" ]
      [ button [ onClick HideForm; class' "button-secondary" ] [ text "Lihat Hasil" ]
      ; button [ onClick SubmitVote ] [ text "Kirim" ]
      ]

let render_form_item (rating : rating) =
  div
    [ class' "benarid-chromeextension-badge-content__form-item" ]
    [ div
        [ class' "benarid-chromeextension-badge-content__form-item-header" ]
        [ text rating.question ]
    ; div
        [ class' "benarid-chromeextension-badge-content__choices" ]
        [ div
            [ class' "benarid-choices" ]
            [ div
                [ onClick (Vote (rating.id, 0))
                ; match rating.value with
                | Some 0 -> class' "benarid-choices-bad selected"
                | _ -> class' "benarid-choices-bad"
                ]
                [ i [ class' "fa fa-thumbs-down" ] []
                ; text "Tidak"
                ]
            ]
        ; div
            [ class' "benarid-choices" ]
            [ div
                [ onClick (Vote (rating.id, 1))
                ; match rating.value with
                | Some 1 -> class' "benarid-choices-good selected"
                | _ -> class' "benarid-choices-good"
                ]
                [ i [ class' "fa fa-thumbs-up" ] []
                ; text "Ya"
                ]
            ]
        ]
    ]

let render_form model =
  div
    []
    [ div
        [ class' "benarid-chromeextension-badge-content__form-item"
        ; style "text-align" "center"
        ]
        [ div
            [ class' "benarid-chromeextension-badge-content__form-item-header" ]
            [ text "Apakah artikel ini..." ]
        ]
    ; div
        [ class' "benarid-chromeextension-badge-content__form" ]
        (Array.to_list @@ Array.map render_form_item model.data.ratings)
    ; div
        [ class' "benarid-chromeextension-badge-content__rate-button" ]
        [ button [ onClick HideForm; class' "button-secondary" ] [ text "Lihat Hasil" ]
        ; button [ onClick SubmitVote ] [ text "Kirim" ]
        ]
    ]

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

let render_rating (rating : rating) =
  let percentage = calculate_percentage rating.sum rating.count in
  div [ class' "benarid-chromeextension-badge-content__rating" ]
    [ div
        [ class' "benarid-chromeextension-badge-content__header" ]
        [ text rating.label
        ; span
            [ class' "benarid-count" ]
            [ text @@ (string_of_int @@ int_of_float percentage) ^ "% "
            ; span
                [ class' "benarid-divider" ]
                [ text @@ "(" ^ (string_of_int rating.count) ^ " votes)" ]
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
  match model.data.rated, model.user with
  | Some true, _ ->
    div
      [ class' "benarid-chromeextension-badge-content__rate-button" ]
      [ text "Terima kasih! Anda sudah menilai artikel ini." ]
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
        (Array.to_list @@ Array.map render_rating model.data.ratings)
    ; render_button model
    ]

let view (model : model) =
  div []
    [ if model.show_form
      then render_form model
      else render_ratings model
    ; div [ class' "benarid-chromeextension-badge-content__loggedin-message" ]
        [ match model.user with (* TODO: render sign in *)
          | Some user ->
            span []
              [ text ("Telah masuk sebagai " ^ user.name ^ ". ")
              ; a [ onClick ClickSignOut ] [ text "Keluar" ]
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
