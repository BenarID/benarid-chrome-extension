type vote

type t =
  | SignIn
  | SignInInitiated
  | SignOut

  | FetchRating
  | FetchRatingSuccess

  | SubmitVote
  | SubmitVoteClicked
  | SubmitVoteInitiated
  | SubmitVoteSuccess

  | ShowForm
  | HideForm

  | ClickSignIn
