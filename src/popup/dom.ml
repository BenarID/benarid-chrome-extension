type dom
external dom : dom = "document" [@@bs.val]
external get_element_by_id_ : dom -> string -> 'a = "getElementById" [@@bs.send]

let get_element_by_id = get_element_by_id_ dom
