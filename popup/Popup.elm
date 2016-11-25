port module Popup exposing (..)

import Html exposing (..)
import Html.App as App
import Html.Attributes exposing (..)
import Html.Events exposing (..)

main =
  App.program
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }

-- MODEL

type alias Model =
  { name: Maybe String
  , signingIn: Bool
  }

init : (Model, Cmd Msg)
init =
  (Model Nothing False, Cmd.none)

-- UPDATE

type Msg
  = SignIn
  -- | SignInFailed
  -- | SignInSuccess

port signIn : () -> Cmd msg
-- port signOut : () -> Cmd msg
-- port fetchRating : () -> Cmd msg
-- port submitRating : RatingForm -> Cmd msg

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    SignIn ->
      ( { model | signingIn = True }, signIn () )

view : Model -> Html Msg
view model =
  case model.signingIn of
    True ->
      text "Signing in..."
    False ->
      button [ onClick SignIn ] [ text "Sign in" ]

-- SUBSCRIPTIONS

-- port signInSub : (SignInResponse -> msg) -> Sub msg
-- port fetchRatingSub : (FetchRatingResponse -> msg) -> Sub msg
-- port submitRatingSub : (SubmitRatingResponse -> msg) -> Sub msg

subscriptions model =
  Sub.none
