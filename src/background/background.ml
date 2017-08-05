[@@@bs.config {no_export = no_export}]

open Actions

let unsafely_unwrap_option = function
  | None -> failwith "No result"
  | Some v -> v

let get_rating_from_storage () =
  Chrome.Storage.Local.get_p "ratings"

let set_rating_to_storage url ratings (storage_value : Js.Json.t Js.Dict.t) =
  let original_ratings =
    Js.Dict.get storage_value "ratings"
    |> (fun opt ->
      match opt with
      | None -> Js.Dict.empty ()
      | Some d -> Js.Json.decodeObject d |> unsafely_unwrap_option
    )
  in
  let ratings' =
    original_ratings
    |> Js.Dict.entries
    |> Array.append [| (url, Js.Json.object_ ratings) |]
    |> Js.Dict.fromArray
    |> Js.Json.object_
  in
  let new_value = Js.Dict.fromArray [| ("ratings", ratings') |] in
  Chrome.Storage.Local.set_p new_value

let try_fetch_rating tab_id url =
  if Js.String.startsWith "http" url
    then begin
      let _ = Js.Promise.(
        Service.fetch_rating url
        |> then_ (fun response ->
          let response_dict = response |> Js.Json.decodeObject |> unsafely_unwrap_option in
          get_rating_from_storage ()
          |> then_ (fun ratings -> set_rating_to_storage url response_dict ratings |> resolve)
          |> then_ (fun _ -> Chrome.PageAction.show tab_id |> resolve)
          |> resolve
        )
      ) in ()
    end

let _ =
  Chrome.Tabs.add_updated_listener (fun tab_id change_info tab ->
    match change_info##status with
    | "complete" -> try_fetch_rating tab_id tab##url
    | _ -> ()
  );

  Chrome.Runtime.add_message_listener (fun msg _sender ->
    match msg##action with
    | FetchRating ->
        let _ = Js.Promise.(
          get_rating_from_storage ()
          |> then_ (fun storage_value ->
            Chrome.Tabs.query_p [%bs.obj { active = Js.true_ ; currentWindow = Js.true_ }]
            |> then_ (fun tabs ->
              let tab = Array.get tabs 0 in
              let ratings =
                Js.Dict.get storage_value "ratings"
                |> unsafely_unwrap_option
                |> Js.Json.decodeObject
                |> unsafely_unwrap_option
              in
              let rating = Js.Dict.get ratings tab##url |> unsafely_unwrap_option in
              resolve rating
            )
          )
          |> then_ (fun rating ->
            Chrome.Runtime.send_message
              [%bs.obj { action = FetchRatingSuccess; payload = rating }];
            resolve ()
          )
        ) in ()
    | _ -> ()
  )
