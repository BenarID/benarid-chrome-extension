type vote

type t =
  | SignIn
  | SignInInitiated
  | SignOut

  | FetchData
  | FetchDataSuccess

  | SubmitVote
  | SubmitVoteClicked
  | SubmitVoteInitiated
  | SubmitVoteSuccess

  | ShowForm
  | HideForm

  | ClickSignIn
