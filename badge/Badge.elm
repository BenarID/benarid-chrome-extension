port module Badge exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

main : Program Flags Model Msg
main =
  programWithFlags
    { init = init
    , update = update
    , subscriptions = subscriptions
    , view = view
    }

-- Model

type alias Rating =
  { label : String
  , question : String
  , sum : Int
  , count : Int
  }

type alias Data =
  { rating : List Rating
  , rated : Maybe Bool
  }

type alias User =
  { name : String
  , id : Int
  }

type alias Model =
  { showForm : Bool
  , user : Maybe User
  , data : Data
  }

type alias Flags =
  { data: Data
  , user: Maybe User
  }

init : Flags -> (Model, Cmd msg)
init flags =
  let
    showForm = case flags.user of
      Just user -> True
      Nothing -> False
  in
    ( { showForm = showForm, user = flags.user, data = flags.data }, resize () )

-- Update

type Msg
  = ShowForm
  | HideForm
  | SignIn
  | SignOut
  | UserData (Maybe User)

port resize : () -> Cmd msg
port signIn : () -> Cmd msg
port signOut : () -> Cmd msg

update : Msg -> Model -> (Model, Cmd msg)
update msg model =
  case msg of
    ShowForm ->
      ( { model | showForm = True }, resize () )
    HideForm ->
      ( { model | showForm = False }, resize () )
    SignIn ->
      ( model, signIn () )
    SignOut ->
      ( model, signOut () )
    UserData user ->
      let data = model.data in
      case user of
        Just userData ->
          ( { model | showForm = True, user = user }, resize () )
        Nothing ->
          ( { model | showForm = False, user = user, data = { data | rated = Nothing } }, resize () )

-- View

view : Model -> Html Msg
view model =
  div []
    [ case model.showForm of
        False ->
          renderRatings model
        True ->
          renderForm model
    , div [ class "benarid-chromeextension-badge-content__loggedin-message" ]
      [ case model.user of
          Just user ->
            small []
              [ text ("Telah masuk sebagai " ++ user.name ++ ". ")
              , a [ onClick SignOut ] [ text "Keluar" ]
              ]
          Nothing ->
            span [] []
      ]
    ]

renderRatings : Model -> Html Msg
renderRatings model =
  div
    []
    [ div [] (List.map renderRating model.data.rating)
    , renderButton model
    ]

renderButton : Model -> Html Msg
renderButton model =
  case ( model.data.rated, model.user ) of
    ( Just True, _ ) ->
      div
        [ class "benarid-chromeextension-badge-content__rate-button" ]
        [ text "Anda sudah menilai artikel ini" ]
    ( _ , Just user ) ->
      div
        [ class "benarid-chromeextension-badge-content__rate-button" ]
        [ button [ onClick ShowForm ] [ text "Nilai artikel ini" ] ]
    _ ->
      div
        [ class "benarid-chromeextension-badge-content__rate-button" ]
        [ button [ onClick SignIn ] [ text "Login untuk menilai" ] ]

renderRating : Rating -> Html Msg
renderRating rating =
  let
    percentage = calculatePercentage rating.sum rating.count
  in
    div
    [ class "benarid-chromeextension-badge-content__rating" ]
    [ div
      [ class "benarid-chromeextension-badge-content__header" ]
      [ text (rating.label ++ ": ")
      , span
        [ class "benarid-count" ]
        [ text (toString percentage)
        , span
          [ class "benarid-divider" ]
          [ text ("% (" ++ toString rating.count ++ " votes)") ]
        ]
      ]
    , div
      [ class "benarid-chromeextension-badge-content__value" ]
      [ div
        [ class ("benarid-rating-bar benarid-" ++ getColor percentage)
        , style [("width", toString percentage ++ "%")] ]
        []
      ]
    ]

calculatePercentage : Int -> Int -> Float
calculatePercentage count divider =
  if divider <= 0 then
    0.0
  else
    100.0 * toFloat count / toFloat divider

renderForm : Model -> Html Msg
renderForm model =
  div
  []
  [ div
    [ class "benarid-chromeextension-badge-content__form-item"
    , style [("text-align", "center")]
    ]
    [ div
      [ class "benarid-chromeextension-badge-content__form-item-header" ]
      [ text "Apakah artikel ini..." ]
    ]
  , div [] (List.map renderFormItem model.data.rating)
  , div
    [ class "benarid-chromeextension-badge-content__rate-button" ]
    [ button [ onClick HideForm ] [ text "Lihat Hasil" ]
    , button [ onClick ShowForm ] [ text "Kirim" ]
    ]
  ]

renderFormItem : Rating -> Html Msg
renderFormItem rating =
  div
  [ class "benarid-chromeextension-badge-content__form-item" ]
  [ div
    [ class "benarid-chromeextension-badge-content__form-item-header" ]
    [ text rating.question ]
  , div
    [ class "benarid-chromeextension-badge-content__choices" ]
    [ div
      [ class "benarid-choices" ]
      [ div
        [ class "benarid-choices-bad" ]
        [ i
          [ class "fa fa-thumbs-down" ]
          []
        , text "Tidak"
        ]
      ]
    , div
      [ class "benarid-choices" ]
      [ div
        [ class "benarid-choices-good" ]
        [ i
          [ class "fa fa-thumbs-up" ]
          []
        , text "Ya"
        ]
      ]
    ]
  ]

getColor : Float -> String
getColor percentage =
  if percentage < 50 then
    "red"
  else
    "green"

-- SUBSCRIPTIONS

port userData : (Maybe User -> msg) -> Sub msg

subscriptions : Model -> Sub Msg
subscriptions model =
  userData UserData
