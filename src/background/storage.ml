type get_user = unit -> Model.user option Js.Promise.t
type set_user = Model.user -> unit Js.Promise.t

type get_token = unit -> Model.token option Js.Promise.t
type set_token = Model.token -> unit Js.Promise.t

type get_rating_data = Model.url -> Model.rating_data option Js.Promise.t
type get_rating_data_exn = Model.url -> Model.rating_data Js.Promise.t
type set_rating_data = Model.url -> Model.rating_data -> unit Js.Promise.t

module StorageService =
struct
  let get get_fn key () =
    get_fn [| key |]
    |> Js.Promise.then_ (fun storage_value ->
        Js.Dict.get storage_value key
        |> Js.Promise.resolve
      )

  let set set_fn key value =
    let payload = Js.Dict.fromArray [| (key, value) |] in
    set_fn payload
end

let get_user : get_user = StorageService.get Chrome.Storage.Sync.get_p "user"
let set_user : set_user = StorageService.set Chrome.Storage.Sync.set_p "user"
let get_token : get_token = StorageService.get Chrome.Storage.Sync.get_p "token"
let set_token : set_token = StorageService.set Chrome.Storage.Sync.set_p "token"
let get_rating_data : get_rating_data = fun url -> StorageService.get Chrome.Storage.Local.get_p url ()
let set_rating_data : set_rating_data = StorageService.set Chrome.Storage.Local.set_p
let get_rating_data_exn : get_rating_data_exn = fun url -> get_rating_data url |> Util.Promise.map Js.Option.getExn
