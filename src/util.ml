module Result = struct
  include Js.Result

  let map f = function
    | Ok value -> Ok (f value)
    | Error error -> Error error
end

module Option = struct
  include Js.Option

  let map f = function
    | Some value -> Some (f value)
    | None -> None

  let bind f = function
    | Some value -> f value
    | None -> None
end

module Promise = struct
  include Js.Promise

  let map f promise =
    promise
    |> then_ (fun value ->
        f value |> resolve
      )
end
