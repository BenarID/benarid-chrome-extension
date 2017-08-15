type vote

type t =
  | SignIn
  | SignInInitiated
  | SignOut

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
