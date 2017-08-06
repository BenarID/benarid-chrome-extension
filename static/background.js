(function () {
'use strict';

var invalid_argument = /* tuple */[
  "Invalid_argument",
  -3
];

var assert_failure = /* tuple */[
  "Assert_failure",
  -10
];

invalid_argument.tag = 248;

assert_failure.tag = 248;


/*  Not a pure module */

function caml_array_sub(x, offset, len) {
  var result = new Array(len);
  var j = 0;
  var i = offset;
  while(j < len) {
    result[j] = x[i];
    j = j + 1 | 0;
    i = i + 1 | 0;
  }
  return result;
}

function caml_array_set(xs, index, newval) {
  if (index < 0 || index >= xs.length) {
    throw [
          invalid_argument,
          "index out of bounds"
        ];
  } else {
    xs[index] = newval;
    return /* () */0;
  }
}

function caml_array_get(xs, index) {
  if (index < 0 || index >= xs.length) {
    throw [
          invalid_argument,
          "index out of bounds"
        ];
  } else {
    return xs[index];
  }
}


/* No side effect */

function app(_f, _args) {
  while(true) {
    var args = _args;
    var f = _f;
    var arity = f.length;
    var arity$1 = arity ? arity : 1;
    var len = args.length;
    var d = arity$1 - len | 0;
    if (d) {
      if (d < 0) {
        _args = caml_array_sub(args, arity$1, -d | 0);
        _f = f.apply(null, caml_array_sub(args, 0, arity$1));
        continue ;
        
      } else {
        return (function(f,args){
        return function (x) {
          return app(f, args.concat(/* array */[x]));
        }
        }(f,args));
      }
    } else {
      return f.apply(null, args);
    }
  }
}

function curry_1(o, a0, arity) {
  if (arity > 7 || arity < 0) {
    return app(o, /* array */[a0]);
  } else {
    switch (arity) {
      case 0 : 
      case 1 : 
          return o(a0);
      case 2 : 
          return (function (param) {
              return o(a0, param);
            });
      case 3 : 
          return (function (param, param$1) {
              return o(a0, param, param$1);
            });
      case 4 : 
          return (function (param, param$1, param$2) {
              return o(a0, param, param$1, param$2);
            });
      case 5 : 
          return (function (param, param$1, param$2, param$3) {
              return o(a0, param, param$1, param$2, param$3);
            });
      case 6 : 
          return (function (param, param$1, param$2, param$3, param$4) {
              return o(a0, param, param$1, param$2, param$3, param$4);
            });
      case 7 : 
          return (function (param, param$1, param$2, param$3, param$4, param$5) {
              return o(a0, param, param$1, param$2, param$3, param$4, param$5);
            });
      
    }
  }
}

function _1(o, a0) {
  var arity = o.length;
  if (arity === 1) {
    return o(a0);
  } else {
    return curry_1(o, a0, arity);
  }
}

function curry_2(o, a0, a1, arity) {
  if (arity > 7 || arity < 0) {
    return app(o, /* array */[
                a0,
                a1
              ]);
  } else {
    switch (arity) {
      case 0 : 
      case 1 : 
          return app(o(a0), /* array */[a1]);
      case 2 : 
          return o(a0, a1);
      case 3 : 
          return (function (param) {
              return o(a0, a1, param);
            });
      case 4 : 
          return (function (param, param$1) {
              return o(a0, a1, param, param$1);
            });
      case 5 : 
          return (function (param, param$1, param$2) {
              return o(a0, a1, param, param$1, param$2);
            });
      case 6 : 
          return (function (param, param$1, param$2, param$3) {
              return o(a0, a1, param, param$1, param$2, param$3);
            });
      case 7 : 
          return (function (param, param$1, param$2, param$3, param$4) {
              return o(a0, a1, param, param$1, param$2, param$3, param$4);
            });
      
    }
  }
}

function _2(o, a0, a1) {
  var arity = o.length;
  if (arity === 2) {
    return o(a0, a1);
  } else {
    return curry_2(o, a0, a1, arity);
  }
}


/* No side effect */

var id = [0];

function get_id() {
  id[0] += 1;
  return id[0];
}

function create(str) {
  var v_001 = get_id(/* () */0);
  var v = /* tuple */[
    str,
    v_001
  ];
  v.tag = 248;
  return v;
}

function isCamlExceptionOrOpenVariant(e) {
  if (e === undefined) {
    return /* false */0;
  } else if (e.tag === 248) {
    return /* true */1;
  } else {
    var slot = e[0];
    if (slot !== undefined) {
      return +(slot.tag === 248);
    } else {
      return /* false */0;
    }
  }
}


/* No side effect */

var $$Error = create("Js_exn.Error");

function internalToOCamlException(e) {
  if (isCamlExceptionOrOpenVariant(e)) {
    return e;
  } else {
    return [
            $$Error,
            e
          ];
  }
}


/* No side effect */

function copy(a) {
  var l = a.length;
  if (l) {
    return caml_array_sub(a, 0, l);
  } else {
    return /* array */[];
  }
}

function append(a1, a2) {
  var l1 = a1.length;
  if (l1) {
    if (a2.length) {
      return a1.concat(a2);
    } else {
      return caml_array_sub(a1, 0, l1);
    }
  } else {
    return copy(a2);
  }
}

var Bottom = create("Array.Bottom");


/* No side effect */

// Generated by BUCKLESCRIPT VERSION 1.8.2, PLEASE EDIT WITH CARE
function query(q) {
  return new Promise((function (resolve, _) {
                chrome.tabs.query(q, (function (tabs) {
                        return resolve(tabs);
                      }));
                return /* () */0;
              }));
}

var Tabs = /* module */[/* query */query];

var Sync = /* module */[];

function get(key) {
  return new Promise((function (resolve, _) {
                chrome.storage.local.get(key, (function (result) {
                        return resolve(result);
                      }));
                return /* () */0;
              }));
}

function set(new_value) {
  return new Promise((function (resolve, _) {
                chrome.storage.local.set(new_value, (function () {
                        return resolve(/* () */0);
                      }));
                return /* () */0;
              }));
}

var Local = /* module */[
  /* get */get,
  /* set */set
];

var Storage = /* module */[
  /* Sync */Sync,
  /* Local */Local
];


/* No side effect */

function entries(dict) {
  var keys = Object.keys(dict);
  var l = keys.length;
  var values = new Array(l);
  for(var i = 0 ,i_finish = l - 1 | 0; i <= i_finish; ++i){
    var key = keys[i];
    values[i] = /* tuple */[
      key,
      dict[key]
    ];
  }
  return values;
}

function fromList(entries) {
  var dict = { };
  var _param = entries;
  while(true) {
    var param = _param;
    if (param) {
      var match = param[0];
      dict[match[0]] = match[1];
      _param = param[1];
      continue ;
      
    } else {
      return dict;
    }
  }
}

function fromArray(entries) {
  var dict = { };
  var l = entries.length;
  for(var i = 0 ,i_finish = l - 1 | 0; i <= i_finish; ++i){
    var match = entries[i];
    dict[match[0]] = match[1];
  }
  return dict;
}


/* unsafeDeleteKey Not a pure module */

function __(tag, block) {
  block.tag = tag;
  return block;
}


/* No side effect */

function decodeString(json) {
  if (typeof json === "string") {
    return /* Some */[json];
  } else {
    return /* None */0;
  }
}

function decodeObject(json) {
  if (typeof json === "object" && !Array.isArray(json) && json !== null) {
    return /* Some */[json];
  } else {
    return /* None */0;
  }
}


/* No side effect */

function to_js_boolean(b) {
  if (b) {
    return true;
  } else {
    return false;
  }
}


/* No side effect */

// Generated by BUCKLESCRIPT VERSION 1.8.2, PLEASE EDIT WITH CARE
function encodeRequestMethod(param) {
  if (typeof param === "number") {
    switch (param) {
      case 0 : 
          return "GET";
      case 1 : 
          return "HEAD";
      case 2 : 
          return "POST";
      case 3 : 
          return "PUT";
      case 4 : 
          return "DELETE";
      case 5 : 
          return "CONNECT";
      case 6 : 
          return "OPTIONS";
      case 7 : 
          return "TRACE";
      case 8 : 
          return "PATCH";
      
    }
  } else {
    return param[0];
  }
}

function encodeReferrerPolicy(param) {
  switch (param) {
    case 0 : 
        return "";
    case 1 : 
        return "no-referrer";
    case 2 : 
        return "no-referrer-when-downgrade";
    case 3 : 
        return "same-origin";
    case 4 : 
        return "origin";
    case 5 : 
        return "strict-origin";
    case 6 : 
        return "origin-when-cross-origin";
    case 7 : 
        return "strict-origin-when-cross-origin";
    case 8 : 
        return "unsafe-url";
    
  }
}

function encodeRequestMode(param) {
  switch (param) {
    case 0 : 
        return "navigate";
    case 1 : 
        return "same-origin";
    case 2 : 
        return "no-cors";
    case 3 : 
        return "cors";
    
  }
}

function encodeRequestCredentials(param) {
  switch (param) {
    case 0 : 
        return "omit";
    case 1 : 
        return "same-origin";
    case 2 : 
        return "include";
    
  }
}

function encodeRequestCache(param) {
  switch (param) {
    case 0 : 
        return "default";
    case 1 : 
        return "no-store";
    case 2 : 
        return "reload";
    case 3 : 
        return "no-cache";
    case 4 : 
        return "force-cache";
    case 5 : 
        return "only-if-cached";
    
  }
}

function encodeRequestRedirect(param) {
  switch (param) {
    case 0 : 
        return "follow";
    case 1 : 
        return "error";
    case 2 : 
        return "manual";
    
  }
}

function map$2(f, param) {
  if (param) {
    return /* Some */[_1(f, param[0])];
  } else {
    return /* None */0;
  }
}

function make(method_, headers, body, referrer, $staropt$star, mode, credentials, cache, redirect, $staropt$star$1, keepalive) {
  var referrerPolicy = $staropt$star ? $staropt$star[0] : /* None */0;
  var integrity = $staropt$star$1 ? $staropt$star$1[0] : "";
  var partial_arg = map$2(to_js_boolean, keepalive);
  var partial_arg$1 = /* Some */[integrity];
  var partial_arg$2 = map$2(encodeRequestRedirect, redirect);
  var partial_arg$3 = map$2(encodeRequestCache, cache);
  var partial_arg$4 = map$2(encodeRequestCredentials, credentials);
  var partial_arg$5 = map$2(encodeRequestMode, mode);
  var partial_arg$6 = /* Some */[encodeReferrerPolicy(referrerPolicy)];
  var partial_arg$7 = map$2(encodeRequestMethod, method_);
  return (function () {
      var $js = { };
      if (partial_arg$7) {
        $js.method = partial_arg$7[0];
      }
      if (headers) {
        $js.headers = headers[0];
      }
      if (body) {
        $js.body = body[0];
      }
      if (referrer) {
        $js.referrer = referrer[0];
      }
      if (partial_arg$6) {
        $js.referrerPolicy = partial_arg$6[0];
      }
      if (partial_arg$5) {
        $js.mode = partial_arg$5[0];
      }
      if (partial_arg$4) {
        $js.credentials = partial_arg$4[0];
      }
      if (partial_arg$3) {
        $js.cache = partial_arg$3[0];
      }
      if (partial_arg$2) {
        $js.redirect = partial_arg$2[0];
      }
      if (partial_arg$1) {
        $js.integrity = partial_arg$1[0];
      }
      if (partial_arg) {
        $js.keepalive = partial_arg[0];
      }
      return $js;
    });
}

var RequestInit = [make];


/* No side effect */

// Generated by BUCKLESCRIPT VERSION 1.8.2, PLEASE EDIT WITH CARE
var process_url = "http://localhost:4000/api/process";


/* No side effect */

function getExn(x) {
  if (x) {
    return x[0];
  } else {
    throw new Error("Bs_option.getExn");
  }
}


/* No side effect */

// Generated by BUCKLESCRIPT VERSION 1.8.2, PLEASE EDIT WITH CARE
function parse_error_message(response) {
  var resp_obj = getExn(decodeObject(response));
  return getExn(decodeString(resp_obj["message"]));
}

function make_request(url, data) {
  return fetch(url, RequestInit[/* make */0](/* Some */[/* Post */2], /* Some */[/* array */[/* tuple */[
                          "content-type",
                          "application/json"
                        ]]], /* Some */[JSON.stringify(data)], /* None */0, /* None */0, /* Some */[/* CORS */3], /* None */0, /* None */0, /* None */0, /* None */0, /* None */0)(/* () */0)).then((function (response) {
                return response.json().then((function (resp) {
                              if (response.ok) {
                                return Promise.resolve(/* Ok */__(0, [resp]));
                              } else {
                                return Promise.resolve(/* Error */__(1, [parse_error_message(resp)]));
                              }
                            }));
              }));
}

function to_data(url) {
  return fromList(/* :: */[
              /* tuple */[
                "url",
                url
              ],
              /* [] */0
            ]);
}

function fetch_rating(url) {
  return make_request(process_url, to_data(url));
}


/* Js_dict Not a pure module */

// Generated by BUCKLESCRIPT VERSION 1.8.2, PLEASE EDIT WITH CARE
function set_rating_to_storage(url, ratings, storage_value) {
  var opt = storage_value["ratings"];
  var original_ratings = opt !== undefined ? getExn(decodeObject(opt)) : { };
  var ratings$prime = fromArray(append(/* array */[/* tuple */[
              url,
              ratings
            ]], entries(original_ratings)));
  return _1(Storage[/* Local */1][/* set */1], fromArray(/* array */[/* tuple */[
                    "ratings",
                    ratings$prime
                  ]]));
}

chrome.tabs.onUpdated.addListener((function (tab_id, change_info, tab) {
        var match = change_info.status;
        if (match === "complete") {
          var tab_id$1 = tab_id;
          var url = tab.url;
          if (url.startsWith("http")) {
            var tab_id$2 = tab_id$1;
            var url$1 = url;
            fetch_rating(url$1).then((function (response) {
                      if (response.tag) {
                        return Promise.resolve((console.log(response[0]), /* () */0));
                      } else {
                        var response_dict = getExn(decodeObject(response[0]));
                        return _1(Storage[/* Local */1][/* get */0], "ratings").then((function (ratings) {
                                        return Promise.resolve(set_rating_to_storage(url$1, response_dict, ratings));
                                      })).then((function () {
                                      return Promise.resolve((chrome.pageAction.show(tab_id$2), /* () */0));
                                    }));
                      }
                    })).catch((function () {
                    return Promise.resolve(/* () */0);
                  }));
            return /* () */0;
          } else {
            return 0;
          }
        } else {
          return /* () */0;
        }
      }));

chrome.runtime.onMessage.addListener((function (msg, _) {
        var match = msg.action;
        if (typeof match === "number" && match === 2) {
          _1(Storage[/* Local */1][/* get */0], "ratings").then((function (storage_value) {
                    return Tabs[/* query */0]({
                                  active: true,
                                  currentWindow: true
                                }).then((function (tabs) {
                                  var tab = caml_array_get(tabs, 0);
                                  var ratings = getExn(decodeObject(storage_value["ratings"]));
                                  return Promise.resolve(ratings[tab.url]);
                                }));
                  })).then((function (rating) {
                  chrome.runtime.sendMessage({
                        action: /* FetchRatingSuccess */3,
                        payload: rating
                      });
                  return Promise.resolve(/* () */0);
                }));
          return /* () */0;
        } else {
          return /* () */0;
        }
      }));


/*  Not a pure module */

}());
