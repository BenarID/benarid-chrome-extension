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

function curry_6(o, a0, a1, a2, a3, a4, a5, arity) {
  var exit = 0;
  if (arity > 7 || arity < 0) {
    return app(o, /* array */[
                a0,
                a1,
                a2,
                a3,
                a4,
                a5
              ]);
  } else {
    switch (arity) {
      case 0 : 
      case 1 : 
          exit = 1;
          break;
      case 2 : 
          return app(o(a0, a1), /* array */[
                      a2,
                      a3,
                      a4,
                      a5
                    ]);
      case 3 : 
          return app(o(a0, a1, a2), /* array */[
                      a3,
                      a4,
                      a5
                    ]);
      case 4 : 
          return app(o(a0, a1, a2, a3), /* array */[
                      a4,
                      a5
                    ]);
      case 5 : 
          return app(o(a0, a1, a2, a3, a4), /* array */[a5]);
      case 6 : 
          return o(a0, a1, a2, a3, a4, a5);
      case 7 : 
          return (function (param) {
              return o(a0, a1, a2, a3, a4, a5, param);
            });
      
    }
  }
  if (exit === 1) {
    return app(o(a0), /* array */[
                a1,
                a2,
                a3,
                a4,
                a5
              ]);
  }
  
}

function _6(o, a0, a1, a2, a3, a4, a5) {
  var arity = o.length;
  if (arity === 6) {
    return o(a0, a1, a2, a3, a4, a5);
  } else {
    return curry_6(o, a0, a1, a2, a3, a4, a5, arity);
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

function iter(f, a) {
  for(var i = 0 ,i_finish = a.length - 1 | 0; i <= i_finish; ++i){
    _1(f, a[i]);
  }
  return /* () */0;
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

function get(key) {
  return new Promise((function (resolve, _) {
                chrome.storage.sync.get(key, (function (result) {
                        return resolve(result);
                      }));
                return /* () */0;
              }));
}

function set(new_value) {
  return new Promise((function (resolve, _) {
                chrome.storage.sync.set(new_value, (function () {
                        return resolve(/* () */0);
                      }));
                return /* () */0;
              }));
}

var Sync = /* module */[
  /* get */get,
  /* set */set
];

function get$1(key) {
  return new Promise((function (resolve, _) {
                chrome.storage.local.get(key, (function (result) {
                        return resolve(result);
                      }));
                return /* () */0;
              }));
}

function set$1(new_value) {
  return new Promise((function (resolve, _) {
                chrome.storage.local.set(new_value, (function () {
                        return resolve(/* () */0);
                      }));
                return /* () */0;
              }));
}

var Local = /* module */[
  /* get */get$1,
  /* set */set$1
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
var signin_url = "http://localhost:4000/auth/google";

var retrieve_url = "http://localhost:4000/auth/retrieve";

var process_url = "http://localhost:4000/api/process";

var me_url = "http://localhost:4000/api/me";


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

function make_headers(token) {
  var content_type = /* tuple */[
    "content-type",
    "application/json"
  ];
  if (token) {
    return /* array */[
            content_type,
            /* tuple */[
              "authorization",
              "Bearer " + token[0]
            ]
          ];
  } else {
    return /* array */[content_type];
  }
}

function make_init(method_, token, data) {
  var func = RequestInit[/* make */0];
  var default_init = function (param, param$1, param$2) {
    return _6(func, /* Some */[method_], /* Some */[make_headers(token)], param, param$1, param$2, /* Some */[/* CORS */3]);
  };
  if (data) {
    return _6(default_init(/* Some */[JSON.stringify(data[0])], /* None */0, /* None */0), /* None */0, /* None */0, /* None */0, /* None */0, /* None */0, /* () */0);
  } else {
    return _6(default_init(/* None */0, /* None */0, /* None */0), /* None */0, /* None */0, /* None */0, /* None */0, /* None */0, /* () */0);
  }
}

function make_request(method_, url, token, data) {
  return fetch(url, make_init(method_, token, data)).then((function (response) {
                return response.json().then((function (resp) {
                              if (response.ok) {
                                return Promise.resolve(/* Ok */__(0, [resp]));
                              } else {
                                return Promise.resolve(/* Error */__(1, [parse_error_message(resp)]));
                              }
                            }));
              }));
}

function fetch_rating(token, url) {
  var data = fromList(/* :: */[
        /* tuple */[
          "url",
          url
        ],
        /* [] */0
      ]);
  return make_request(/* Post */2, process_url, token, /* Some */[data]);
}

function fetch_user_data(token) {
  return make_request(/* Get */0, me_url, /* Some */[token], /* None */0);
}


/* Js_dict Not a pure module */

// Generated by BUCKLESCRIPT VERSION 1.8.2, PLEASE EDIT WITH CARE
function get_from_storage(get_fn, key, decode_fn) {
  return _1(get_fn, key).then((function (storage_value) {
                return Promise.resolve(_1(decode_fn, storage_value[key]));
              }));
}

function get_from_local_storage(key, decode_fn) {
  return get_from_storage(Storage[/* Local */1][/* get */0], key, decode_fn);
}

function get_from_sync_storage(key, decode_fn) {
  return get_from_storage(Storage[/* Sync */0][/* get */0], key, decode_fn);
}

function get_ratings_from_storage_exn() {
  return get_from_local_storage("ratings", decodeObject).then((function (ratings) {
                return Promise.resolve(getExn(ratings));
              }));
}

function append_rating_to_storage(url, ratings) {
  return get_from_local_storage("ratings", decodeObject).then((function (opt) {
                  if (opt) {
                    return Promise.resolve(opt[0]);
                  } else {
                    return Promise.resolve({ });
                  }
                })).then((function (original_ratings) {
                var ratings$prime = fromArray(append(/* array */[/* tuple */[
                            url,
                            ratings
                          ]], entries(original_ratings)));
                return _1(Storage[/* Local */1][/* set */1], fromArray(/* array */[/* tuple */[
                                  "ratings",
                                  ratings$prime
                                ]]));
              }));
}

chrome.tabs.onUpdated.addListener((function (tab_id, change_info, tab) {
        var match = change_info.status;
        if (match === "loading" && tab.url.startsWith("http")) {
          var tab_id$1 = tab_id;
          var url = tab.url;
          get_from_sync_storage("token", decodeString).then((function (token) {
                      return fetch_rating(token, url);
                    })).then((function (response) {
                    if (response.tag) {
                      return Promise.resolve((console.log(response[0]), /* () */0));
                    } else {
                      var rating = getExn(decodeObject(response[0]));
                      return append_rating_to_storage(url, rating).then((function () {
                                    return Promise.resolve((chrome.pageAction.show(tab_id$1), /* () */0));
                                  }));
                    }
                  })).catch((function () {
                  return Promise.resolve(/* () */0);
                }));
          return /* () */0;
        } else {
          return /* () */0;
        }
      }));

chrome.runtime.onMessage.addListener((function (msg, _) {
        var match = msg.action;
        if (match !== 3) {
          if (match !== 0) {
            return /* () */0;
          } else {
            console.log("Received SignIn");
            var window_props = {
              url: signin_url,
              height: 500,
              width: 600,
              type: "popup"
            };
            chrome.windows.create(window_props);
            chrome.tabs.onUpdated.addListener((function (_, _$1, _$2) {
                    Tabs[/* query */0]({ }).then((function (tabs) {
                            return Promise.resolve(iter((function (tab) {
                                              if (tab.url.includes(retrieve_url)) {
                                                var tab$1 = tab;
                                                var token = caml_array_get(caml_array_get(tab$1.url.split("#"), 1).split("="), 1);
                                                fetch_user_data(token).then((function (response) {
                                                        if (response.tag) {
                                                          return Promise.resolve((console.log(response[0]), /* () */0));
                                                        } else {
                                                          var payload = fromArray(/* array */[
                                                                /* tuple */[
                                                                  "token",
                                                                  token
                                                                ],
                                                                /* tuple */[
                                                                  "user",
                                                                  response[0]
                                                                ]
                                                              ]);
                                                          _1(Storage[/* Sync */0][/* set */1], payload);
                                                          return Promise.resolve(/* () */0);
                                                        }
                                                      }));
                                                chrome.tabs.remove(tab$1.id);
                                                return /* () */0;
                                              } else {
                                                return 0;
                                              }
                                            }), tabs));
                          }));
                    return /* () */0;
                  }));
            return /* () */0;
          }
        } else {
          console.log("Received FetchData");
          Promise.all(/* tuple */[
                    get_ratings_from_storage_exn(/* () */0),
                    get_from_sync_storage("user", decodeObject)
                  ]).then((function (param) {
                    var user = param[1];
                    var ratings = param[0];
                    console.log(user);
                    return Tabs[/* query */0]({
                                  active: true,
                                  currentWindow: true
                                }).then((function (tabs) {
                                  var tab = caml_array_get(tabs, 0);
                                  var rating = ratings[tab.url];
                                  return Promise.resolve(/* tuple */[
                                              rating,
                                              user
                                            ]);
                                }));
                  })).then((function (param) {
                  chrome.runtime.sendMessage({
                        action: /* FetchDataSuccess */4,
                        payload: {
                          rating: param[0],
                          user: param[1]
                        }
                      });
                  return Promise.resolve(/* () */0);
                }));
          return /* () */0;
        }
      }));


/*  Not a pure module */

}());
