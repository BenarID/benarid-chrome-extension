module Result = struct
  let map f = function
    | Js.Result.Ok value -> Js.Result.Ok (f value)
    | Js.Result.Error error -> Js.Result.Error error
end

module Option = struct
  let map f = function
    | Some value -> Some (f value)
    | None -> None

  let bind f = function
    | Some value -> f value
    | None -> None
end

module Promise = struct
  let map f promise =
    promise
    |> Js.Promise.then_ (fun value ->
        f value |> Js.Promise.resolve
      )
end
