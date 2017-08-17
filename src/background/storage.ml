type get_user = unit -> Model.user_obj option Js.Promise.t
type set_user = Model.user_obj -> unit Js.Promise.t
type remove_user = unit -> unit Js.Promise.t

type get_token = unit -> Model.token option Js.Promise.t
type get_token_exn = unit -> Model.token Js.Promise.t
type set_token = Model.token -> unit Js.Promise.t
type remove_token = unit -> unit Js.Promise.t

type get_rating_data = Model.url -> Model.rating_data_obj option Js.Promise.t
type get_rating_data_exn = Model.url -> Model.rating_data_obj Js.Promise.t
type set_rating_data = Model.url -> Model.rating_data_obj -> unit Js.Promise.t

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

  let remove remove_fn key () =
    remove_fn [| key |]
end

let get_user : get_user = StorageService.get Chrome.Storage.Sync.get_p "user"
let set_user : set_user = StorageService.set Chrome.Storage.Sync.set_p "user"
let remove_user : remove_user = StorageService.remove Chrome.Storage.Sync.remove_p "user"

let get_token : get_token = StorageService.get Chrome.Storage.Sync.get_p "token"
let get_token_exn : get_token_exn = fun () -> get_token () |> Util.Promise.map Js.Option.getExn
let set_token : set_token = StorageService.set Chrome.Storage.Sync.set_p "token"
let remove_token : remove_token = StorageService.remove Chrome.Storage.Sync.remove_p "token"

let get_rating_data : get_rating_data = fun url -> StorageService.get Chrome.Storage.Local.get_p url ()
let get_rating_data_exn : get_rating_data_exn = fun url -> get_rating_data url |> Util.Promise.map Js.Option.getExn
let set_rating_data : set_rating_data = StorageService.set Chrome.Storage.Local.set_p
