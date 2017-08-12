(* Fix types later *)


module Runtime = struct
  external send_message
    : < .. > Js.t -> unit
    = "chrome.runtime.sendMessage" [@@bs.val]

  external add_message_listener
    : (< .. > Js.t -> < .. > Js.t -> unit [@bs.uncurry]) -> unit
    = "chrome.runtime.onMessage.addListener" [@@bs.val]
end


module Extension = struct
  external get_url
    : 'a
    = "chrome.extension.getUrl" [@@bs.val]
end


module Tabs = struct
  type tab_id

  external send_message
    : 'a
    = "chrome.tabs.sendMessage" [@@bs.val]

  external query_
    : < .. > Js.t -> (< .. > Js.t array -> unit [@bs.uncurry]) -> unit
    = "chrome.tabs.query" [@@bs.val]

  external add_updated_listener
    : (tab_id -> < status:string; .. > Js.t -> < .. > Js.t -> unit [@bs.uncurry]) -> unit
    = "chrome.tabs.onUpdated.addListener" [@@bs.val]

  external add_activated_listener
    : (< tab_id:tab_id; .. > Js.t -> unit [@bs.uncurry]) -> unit
    = "chrome.tabs.onActivated.addListener" [@@bs.val]

  external remove
    : tab_id -> unit
    = "chrome.tabs.remove" [@@bs.val]

  let query q =
    Js.Promise.make (fun ~resolve ~reject:_ ->
        query_ q (fun tabs ->
            resolve tabs [@bs]
          )
      )
end


module PageAction = struct
  external show
    : Tabs.tab_id -> unit
    = "chrome.pageAction.show" [@@bs.val]
end


module Storage = struct

  module Sync = struct

    external get
      : string array -> ('a Js.Dict.t -> unit [@bs.uncurry]) -> unit
      = "chrome.storage.sync.get" [@@bs.val]

    external set
      : 'a Js.Dict.t -> (unit -> unit [@bs.uncurry]) -> unit
      = "chrome.storage.sync.set" [@@bs.val]

    external remove
      : string array -> (unit -> unit [@bs.uncurry]) -> unit
      = "chrome.storage.sync.remove" [@@bs.val]

    (* Promise versions *)
    let get_p keys =
      Js.Promise.make (fun ~resolve ~reject:_ ->
          get keys (fun result ->
              resolve result [@bs]
            )
        )

    let set_p values =
      Js.Promise.make (fun ~resolve ~reject:_ ->
          set values (fun result ->
              resolve result [@bs]
            )
        )

    let remove_p keys =
      Js.Promise.make (fun ~resolve ~reject:_ ->
          remove keys (fun result ->
              resolve result [@bs]
            )
        )

  end

  module Local = struct

    external get
      : string array -> ('a Js.Dict.t -> unit [@bs.uncurry]) -> unit
      = "chrome.storage.local.get" [@@bs.val]

    external set
      : 'a Js.Dict.t -> (unit -> unit [@bs.uncurry]) -> unit
      = "chrome.storage.local.set" [@@bs.val]

    external remove
      : string array -> (unit -> unit [@bs.uncurry]) -> unit
      = "chrome.storage.local.remove" [@@bs.val]

    (* Promise versions *)
    let get_p keys =
      Js.Promise.make (fun ~resolve ~reject:_ ->
          get keys (fun result ->
              resolve result [@bs]
            )
        )

    let set_p values =
      Js.Promise.make (fun ~resolve ~reject:_ ->
          set values (fun result ->
              resolve result [@bs]
            )
        )

    let remove_p keys =
      Js.Promise.make (fun ~resolve ~reject:_ ->
          remove keys (fun result ->
              resolve result [@bs]
            )
        )

  end

end


module Windows = struct
  external create
    : < .. > Js.t -> unit
    = "chrome.windows.create" [@@bs.val]
end
