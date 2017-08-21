type id = Chrome.Tabs.tab_id

let open_auth_popup () =
  let window_props = [%bs.obj { url = Constants.signin_url; height = 500; width = 600; _type = "popup" }] in
  Chrome.Windows.create window_props

let get_all_tabs () =
  Chrome.Tabs.query_p (Js.Obj.empty ())

let get_active_tab () =
  Chrome.Tabs.query_p [%bs.obj { active = Js.true_ ; currentWindow = Js.true_ }]
  |> Util.Promise.map (fun tabs -> Array.get tabs 0)

let remove_tab = Chrome.Tabs.remove_p
let enable_extension = Chrome.PageAction.show
let attach_listener = Chrome.Tabs.add_updated_listener
