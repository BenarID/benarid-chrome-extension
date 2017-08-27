type t =
  | SignIn
  | SignInInitiated
  | SignOut
  | SignOutInitiated
  | SignOutSuccess
  | SignOutFailed

  | FetchData
  | FetchDataSuccess

  | Vote of int * int
  | SubmitVote
  | SubmitVoteClicked
  | SubmitVoteInitiated
  | SubmitVoteSuccess
  | SubmitVoteFailed

  | ShowForm
  | HideForm

  | ClickSignIn
  | ClickSignOut
