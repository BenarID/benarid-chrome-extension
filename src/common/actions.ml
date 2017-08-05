type vote

type t =
  | SignIn
  | SignOut

  | FetchRating
  | FetchRatingSuccess

  | SubmitVote of vote
  | SubmitVoteSuccess
