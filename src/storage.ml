open Util

module StorageService = struct
  let get get_fn key () =
    get_fn [| key |]
    |> Promise.then_ (fun storage_value ->
        Js.Dict.get storage_value key
        |> Promise.resolve
      )

  let set set_fn key value =
    let payload = Js.Dict.fromArray [| (key, value) |] in
    set_fn payload

  let remove remove_fn key () =
    remove_fn [| key |]
end

let get_user = StorageService.get Chrome.Storage.Sync.get_p "user"
let set_user = StorageService.set Chrome.Storage.Sync.set_p "user"
let remove_user = StorageService.remove Chrome.Storage.Sync.remove_p "user"

let get_token = StorageService.get Chrome.Storage.Sync.get_p "token"
let get_token_exn = fun () -> get_token () |> Promise.map Option.getExn
let set_token = StorageService.set Chrome.Storage.Sync.set_p "token"
let remove_token = StorageService.remove Chrome.Storage.Sync.remove_p "token"

let get_rating_data = fun id -> StorageService.get Chrome.Storage.Local.get_p id ()
let get_rating_data_exn = fun id -> get_rating_data id |> Promise.map Option.getExn
let set_rating_data = StorageService.set Chrome.Storage.Local.set_p
