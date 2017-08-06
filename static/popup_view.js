var Popup_view = (function (exports) {
'use strict';

var failure = /* tuple */[
  "Failure",
  -2
];

var invalid_argument = /* tuple */[
  "Invalid_argument",
  -3
];

var match_failure = /* tuple */[
  "Match_failure",
  -7
];

var assert_failure = /* tuple */[
  "Assert_failure",
  -10
];

failure.tag = 248;

invalid_argument.tag = 248;

match_failure.tag = 248;

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

function caml_make_vect(len, init) {
  var b = new Array(len);
  for(var i = 0 ,i_finish = len - 1 | 0; i <= i_finish; ++i){
    b[i] = init;
  }
  return b;
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

function curry_3(o, a0, a1, a2, arity) {
  var exit = 0;
  if (arity > 7 || arity < 0) {
    return app(o, /* array */[
                a0,
                a1,
                a2
              ]);
  } else {
    switch (arity) {
      case 0 : 
      case 1 : 
          exit = 1;
          break;
      case 2 : 
          return app(o(a0, a1), /* array */[a2]);
      case 3 : 
          return o(a0, a1, a2);
      case 4 : 
          return (function (param) {
              return o(a0, a1, a2, param);
            });
      case 5 : 
          return (function (param, param$1) {
              return o(a0, a1, a2, param, param$1);
            });
      case 6 : 
          return (function (param, param$1, param$2) {
              return o(a0, a1, a2, param, param$1, param$2);
            });
      case 7 : 
          return (function (param, param$1, param$2, param$3) {
              return o(a0, a1, a2, param, param$1, param$2, param$3);
            });
      
    }
  }
  if (exit === 1) {
    return app(o(a0), /* array */[
                a1,
                a2
              ]);
  }
  
}

function _3(o, a0, a1, a2) {
  var arity = o.length;
  if (arity === 3) {
    return o(a0, a1, a2);
  } else {
    return curry_3(o, a0, a1, a2, arity);
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

function map(f, a) {
  var l = a.length;
  if (l) {
    var r = caml_make_vect(l, _1(f, a[0]));
    for(var i = 1 ,i_finish = l - 1 | 0; i <= i_finish; ++i){
      r[i] = _1(f, a[i]);
    }
    return r;
  } else {
    return /* array */[];
  }
}

function to_list(a) {
  var _i = a.length - 1 | 0;
  var _res = /* [] */0;
  while(true) {
    var res = _res;
    var i = _i;
    if (i < 0) {
      return res;
    } else {
      _res = /* :: */[
        a[i],
        res
      ];
      _i = i - 1 | 0;
      continue ;
      
    }
  }
}

var Bottom = create("Array.Bottom");


/* No side effect */

// Generated by BUCKLESCRIPT VERSION 1.8.2, PLEASE EDIT WITH CARE
function polyfills() {
  ((
  // remove polyfill
  (function() {
    if (!('remove' in Element.prototype)) {
      Element.prototype.remove = function() {
        if (this.parentNode) {
          this.parentNode.removeChild(this);
        }
      };
    }
  }())
  ));
  ((
  // requestAnimationFrame polyfill
  (function() {
      var lastTime = 0;
      var vendors = ['ms', 'moz', 'webkit', 'o'];
      for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
          window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
          window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                     || window[vendors[x]+'CancelRequestAnimationFrame'];
      }

      if (!window.requestAnimationFrame)
          window.requestAnimationFrame = function(callback, element) {
              var currTime = new Date().getTime();
              var timeToCall = Math.max(0, 16 - (currTime - lastTime));
              var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
              lastTime = currTime + timeToCall;
              return id;
          };

      if (!window.cancelAnimationFrame)
          window.cancelAnimationFrame = function(id) {
              clearTimeout(id);
          };
  }())
  ));
  return /* () */0;
}


/* No side effect */

function __(tag, block) {
  block.tag = tag;
  return block;
}


/* No side effect */

function caml_equal(_a, _b) {
  while(true) {
    var b = _b;
    var a = _a;
    if (a === b) {
      return /* true */1;
    } else {
      var a_type = typeof a;
      if (a_type === "string" || a_type === "number" || a_type === "boolean" || a_type === "undefined" || a === null) {
        return /* false */0;
      } else {
        var b_type = typeof b;
        if (a_type === "function" || b_type === "function") {
          throw [
                invalid_argument,
                "equal: functional value"
              ];
        } else if (b_type === "number" || b_type === "undefined" || b === null) {
          return /* false */0;
        } else {
          var tag_a = a.tag | 0;
          var tag_b = b.tag | 0;
          if (tag_a === 250) {
            _a = a[0];
            continue ;
            
          } else if (tag_b === 250) {
            _b = b[0];
            continue ;
            
          } else if (tag_a === 248) {
            return +(a[1] === b[1]);
          } else if (tag_a === 251) {
            throw [
                  invalid_argument,
                  "equal: abstract value"
                ];
          } else if (tag_a !== tag_b) {
            return /* false */0;
          } else {
            var len_a = a.length | 0;
            var len_b = b.length | 0;
            if (len_a === len_b) {
              var a$1 = a;
              var b$1 = b;
              var _i = 0;
              var same_length = len_a;
              while(true) {
                var i = _i;
                if (i === same_length) {
                  return /* true */1;
                } else if (caml_equal(a$1[i], b$1[i])) {
                  _i = i + 1 | 0;
                  continue ;
                  
                } else {
                  return /* false */0;
                }
              }
            } else {
              return /* false */0;
            }
          }
        }
      }
    }
  }
}


/* No side effect */

/* stdin Not a pure module */

/* No side effect */

var imul = ( Math.imul || function (x,y) {
  y |= 0; return ((((x >> 16) * y) << 16) + (x & 0xffff) * y)|0; 
}
);


/* imul Not a pure module */

/* repeat Not a pure module */

/* two_ptr_32_dbl Not a pure module */

function lowercase(c) {
  if (c >= /* "A" */65 && c <= /* "Z" */90 || c >= /* "\192" */192 && c <= /* "\214" */214 || c >= /* "\216" */216 && c <= /* "\222" */222) {
    return c + 32 | 0;
  } else {
    return c;
  }
}

function parse_format(fmt) {
  var len = fmt.length;
  if (len > 31) {
    throw [
          invalid_argument,
          "format_int: format too long"
        ];
  }
  var f = /* record */[
    /* justify */"+",
    /* signstyle */"-",
    /* filter */" ",
    /* alternate : false */0,
    /* base : Dec */2,
    /* signedconv : false */0,
    /* width */0,
    /* uppercase : false */0,
    /* sign */1,
    /* prec */-1,
    /* conv */"f"
  ];
  var _i = 0;
  while(true) {
    var i = _i;
    if (i >= len) {
      return f;
    } else {
      var c = fmt.charCodeAt(i);
      var exit = 0;
      if (c >= 69) {
        if (c >= 88) {
          if (c >= 121) {
            exit = 1;
          } else {
            switch (c - 88 | 0) {
              case 0 : 
                  f[/* base */4] = /* Hex */1;
                  f[/* uppercase */7] = /* true */1;
                  _i = i + 1 | 0;
                  continue ;
                  case 13 : 
              case 14 : 
              case 15 : 
                  exit = 5;
                  break;
              case 12 : 
              case 17 : 
                  exit = 4;
                  break;
              case 23 : 
                  f[/* base */4] = /* Oct */0;
                  _i = i + 1 | 0;
                  continue ;
                  case 29 : 
                  f[/* base */4] = /* Dec */2;
                  _i = i + 1 | 0;
                  continue ;
                  case 1 : 
              case 2 : 
              case 3 : 
              case 4 : 
              case 5 : 
              case 6 : 
              case 7 : 
              case 8 : 
              case 9 : 
              case 10 : 
              case 11 : 
              case 16 : 
              case 18 : 
              case 19 : 
              case 20 : 
              case 21 : 
              case 22 : 
              case 24 : 
              case 25 : 
              case 26 : 
              case 27 : 
              case 28 : 
              case 30 : 
              case 31 : 
                  exit = 1;
                  break;
              case 32 : 
                  f[/* base */4] = /* Hex */1;
                  _i = i + 1 | 0;
                  continue ;
                  
            }
          }
        } else if (c >= 72) {
          exit = 1;
        } else {
          f[/* signedconv */5] = /* true */1;
          f[/* uppercase */7] = /* true */1;
          f[/* conv */10] = String.fromCharCode(lowercase(c));
          _i = i + 1 | 0;
          continue ;
          
        }
      } else {
        var switcher = c - 32 | 0;
        if (switcher > 25 || switcher < 0) {
          exit = 1;
        } else {
          switch (switcher) {
            case 3 : 
                f[/* alternate */3] = /* true */1;
                _i = i + 1 | 0;
                continue ;
                case 0 : 
            case 11 : 
                exit = 2;
                break;
            case 13 : 
                f[/* justify */0] = "-";
                _i = i + 1 | 0;
                continue ;
                case 14 : 
                f[/* prec */9] = 0;
                var j = i + 1 | 0;
                while((function(j){
                    return function () {
                      var w = fmt.charCodeAt(j) - /* "0" */48 | 0;
                      return +(w >= 0 && w <= 9);
                    }
                    }(j))()) {
                  f[/* prec */9] = (imul(f[/* prec */9], 10) + fmt.charCodeAt(j) | 0) - /* "0" */48 | 0;
                  j = j + 1 | 0;
                };
                _i = j;
                continue ;
                case 1 : 
            case 2 : 
            case 4 : 
            case 5 : 
            case 6 : 
            case 7 : 
            case 8 : 
            case 9 : 
            case 10 : 
            case 12 : 
            case 15 : 
                exit = 1;
                break;
            case 16 : 
                f[/* filter */2] = "0";
                _i = i + 1 | 0;
                continue ;
                case 17 : 
            case 18 : 
            case 19 : 
            case 20 : 
            case 21 : 
            case 22 : 
            case 23 : 
            case 24 : 
            case 25 : 
                exit = 3;
                break;
            
          }
        }
      }
      switch (exit) {
        case 1 : 
            _i = i + 1 | 0;
            continue ;
            case 2 : 
            f[/* signstyle */1] = String.fromCharCode(c);
            _i = i + 1 | 0;
            continue ;
            case 3 : 
            f[/* width */6] = 0;
            var j$1 = i;
            while((function(j$1){
                return function () {
                  var w = fmt.charCodeAt(j$1) - /* "0" */48 | 0;
                  return +(w >= 0 && w <= 9);
                }
                }(j$1))()) {
              f[/* width */6] = (imul(f[/* width */6], 10) + fmt.charCodeAt(j$1) | 0) - /* "0" */48 | 0;
              j$1 = j$1 + 1 | 0;
            };
            _i = j$1;
            continue ;
            case 4 : 
            f[/* signedconv */5] = /* true */1;
            f[/* base */4] = /* Dec */2;
            _i = i + 1 | 0;
            continue ;
            case 5 : 
            f[/* signedconv */5] = /* true */1;
            f[/* conv */10] = String.fromCharCode(c);
            _i = i + 1 | 0;
            continue ;
            
      }
    }
  }
}

function finish_formatting(param, rawbuffer) {
  var justify = param[/* justify */0];
  var signstyle = param[/* signstyle */1];
  var filter = param[/* filter */2];
  var alternate = param[/* alternate */3];
  var base = param[/* base */4];
  var signedconv = param[/* signedconv */5];
  var width = param[/* width */6];
  var uppercase = param[/* uppercase */7];
  var sign = param[/* sign */8];
  var len = rawbuffer.length;
  if (signedconv && (sign < 0 || signstyle !== "-")) {
    len = len + 1 | 0;
  }
  if (alternate) {
    if (base) {
      if (base === /* Hex */1) {
        len = len + 2 | 0;
      }
      
    } else {
      len = len + 1 | 0;
    }
  }
  var buffer = "";
  if (justify === "+" && filter === " ") {
    for(var i = len ,i_finish = width - 1 | 0; i <= i_finish; ++i){
      buffer = buffer + filter;
    }
  }
  if (signedconv) {
    if (sign < 0) {
      buffer = buffer + "-";
    } else if (signstyle !== "-") {
      buffer = buffer + signstyle;
    }
    
  }
  if (alternate && base === /* Oct */0) {
    buffer = buffer + "0";
  }
  if (alternate && base === /* Hex */1) {
    buffer = buffer + "0x";
  }
  if (justify === "+" && filter === "0") {
    for(var i$1 = len ,i_finish$1 = width - 1 | 0; i$1 <= i_finish$1; ++i$1){
      buffer = buffer + filter;
    }
  }
  buffer = uppercase ? buffer + rawbuffer.toUpperCase() : buffer + rawbuffer;
  if (justify === "-") {
    for(var i$2 = len ,i_finish$2 = width - 1 | 0; i$2 <= i_finish$2; ++i$2){
      buffer = buffer + " ";
    }
  }
  return buffer;
}

function caml_format_float(fmt, x) {
  var f = parse_format(fmt);
  var prec = f[/* prec */9] < 0 ? 6 : f[/* prec */9];
  var x$1 = x < 0 ? (f[/* sign */8] = -1, -x) : x;
  var s = "";
  if (isNaN(x$1)) {
    s = "nan";
    f[/* filter */2] = " ";
  } else if (isFinite(x$1)) {
    var match = f[/* conv */10];
    switch (match) {
      case "e" : 
          s = x$1.toExponential(prec);
          var i = s.length;
          if (s[i - 3 | 0] === "e") {
            s = s.slice(0, i - 1 | 0) + ("0" + s.slice(i - 1 | 0));
          }
          break;
      case "f" : 
          s = x$1.toFixed(prec);
          break;
      case "g" : 
          var prec$1 = prec !== 0 ? prec : 1;
          s = x$1.toExponential(prec$1 - 1 | 0);
          var j = s.indexOf("e");
          var exp = Number(s.slice(j + 1 | 0)) | 0;
          if (exp < -4 || x$1 >= 1e21 || x$1.toFixed().length > prec$1) {
            var i$1 = j - 1 | 0;
            while(s[i$1] === "0") {
              i$1 = i$1 - 1 | 0;
            }
            if (s[i$1] === ".") {
              i$1 = i$1 - 1 | 0;
            }
            s = s.slice(0, i$1 + 1 | 0) + s.slice(j);
            var i$2 = s.length;
            if (s[i$2 - 3 | 0] === "e") {
              s = s.slice(0, i$2 - 1 | 0) + ("0" + s.slice(i$2 - 1 | 0));
            }
            
          } else {
            var p = prec$1;
            if (exp < 0) {
              p = p - (exp + 1 | 0) | 0;
              s = x$1.toFixed(p);
            } else {
              while((function () {
                      s = x$1.toFixed(p);
                      return +(s.length > (prec$1 + 1 | 0));
                    })()) {
                p = p - 1 | 0;
              }
            }
            if (p !== 0) {
              var k = s.length - 1 | 0;
              while(s[k] === "0") {
                k = k - 1 | 0;
              }
              if (s[k] === ".") {
                k = k - 1 | 0;
              }
              s = s.slice(0, k + 1 | 0);
            }
            
          }
          break;
      default:
        
    }
  } else {
    s = "inf";
    f[/* filter */2] = " ";
  }
  return finish_formatting(f, s);
}


/* float_of_string Not a pure module */

function get(s, i) {
  if (i < 0 || i >= s.length) {
    throw [
          invalid_argument,
          "index out of bounds"
        ];
  } else {
    return s.charCodeAt(i);
  }
}


/* No side effect */

/* not_implemented Not a pure module */

/* No side effect */

var Exit = create("Pervasives.Exit");

function $caret(a, b) {
  return a + b;
}

function string_of_int(param) {
  return "" + param;
}

function valid_float_lexem(s) {
  var l = s.length;
  var _i = 0;
  while(true) {
    var i = _i;
    if (i >= l) {
      return $caret(s, ".");
    } else {
      var match = get(s, i);
      if (match >= 48) {
        if (match >= 58) {
          return s;
        } else {
          _i = i + 1 | 0;
          continue ;
          
        }
      } else if (match !== 45) {
        return s;
      } else {
        _i = i + 1 | 0;
        continue ;
        
      }
    }
  }
}

function string_of_float(f) {
  return valid_float_lexem(caml_format_float("%.12g", f));
}


/* No side effect */

function rev_append(_l1, _l2) {
  while(true) {
    var l2 = _l2;
    var l1 = _l1;
    if (l1) {
      _l2 = /* :: */[
        l1[0],
        l2
      ];
      _l1 = l1[1];
      continue ;
      
    } else {
      return l2;
    }
  }
}

function rev(l) {
  return rev_append(l, /* [] */0);
}

function map$2(f, param) {
  if (param) {
    var r = _1(f, param[0]);
    return /* :: */[
            r,
            map$2(f, param[1])
          ];
  } else {
    return /* [] */0;
  }
}

function iter$1(f, _param) {
  while(true) {
    var param = _param;
    if (param) {
      _1(f, param[0]);
      _param = param[1];
      continue ;
      
    } else {
      return /* () */0;
    }
  }
}

function fold_left$1(f, _accu, _l) {
  while(true) {
    var l = _l;
    var accu = _accu;
    if (l) {
      _l = l[1];
      _accu = _2(f, accu, l[0]);
      continue ;
      
    } else {
      return accu;
    }
  }
}

function fold_left2(f, _accu, _l1, _l2) {
  while(true) {
    var l2 = _l2;
    var l1 = _l1;
    var accu = _accu;
    if (l1) {
      if (l2) {
        _l2 = l2[1];
        _l1 = l1[1];
        _accu = _3(f, accu, l1[0], l2[0]);
        continue ;
        
      } else {
        throw [
              invalid_argument,
              "List.fold_left2"
            ];
      }
    } else if (l2) {
      throw [
            invalid_argument,
            "List.fold_left2"
          ];
    } else {
      return accu;
    }
  }
}


/* No side effect */

/* No side effect */

/* No side effect */

/* No side effect */

// Generated by BUCKLESCRIPT VERSION 1.8.2, PLEASE EDIT WITH CARE
function setStyle(n, key, value) {
  n.style[key] = value;
  return /* () */0;
}

function setStyleProperty(n, $staropt$star, key, value) {
  var priority = $staropt$star ? $staropt$star[0] : /* false */0;
  var style = n.style;
  var match = style.setProperty;
  if (match !== undefined) {
    return style.setProperty(key, value, priority ? "important" : null);
  } else {
    return setStyle(n, key, value);
  }
}

function insertBefore(n, child, refNode) {
  return n.insertBefore(child, refNode);
}

function setAttributeNsOptional(n, namespace, key, value) {
  if (namespace === "") {
    return n.setAttribute(key, value);
  } else {
    return n.setAttributeNS(namespace, key, value);
  }
}

function removeAttributeNsOptional(n, namespace, key) {
  if (namespace === "") {
    return n.removeAttribute(key);
  } else {
    return n.removeAttributeNS(namespace, key);
  }
}

function addEventListener(n, typ, listener, options) {
  return n.addEventListener(typ, listener, options);
}

function removeEventListener(n, typ, listener, options) {
  return n.removeEventListener(typ, listener, options);
}


/* No side effect */

// Generated by BUCKLESCRIPT VERSION 1.8.2, PLEASE EDIT WITH CARE
function createElementNsOptional(namespace, tagName) {
  if (namespace === "") {
    return document.createElement(tagName);
  } else {
    return document.createElementNS(namespace, tagName);
  }
}


/* No side effect */

// Generated by BUCKLESCRIPT VERSION 1.8.2, PLEASE EDIT WITH CARE
var noNode = /* CommentNode */__(0, [""]);

function fullnode(namespace, tagName, key, unique, props, vdoms) {
  return /* Node */__(2, [
            namespace,
            tagName,
            key,
            unique,
            props,
            vdoms
          ]);
}

function style(key, value) {
  return /* Style */__(4, [/* :: */[
              /* tuple */[
                key,
                value
              ],
              /* [] */0
            ]]);
}

function eventHandler(callbacks, cb) {
  return (function (ev) {
      var match = _1(cb[0], ev);
      if (match) {
        return _1(callbacks[0][/* enqueue */0], match[0]);
      } else {
        return /* () */0;
      }
    });
}

function eventHandler_GetCB(param) {
  if (param.tag) {
    var msg = param[0];
    return (function () {
        return /* Some */[msg];
      });
  } else {
    return param[1];
  }
}

function compareEventHandlerTypes(left, param) {
  if (param.tag) {
    if (!left.tag || !caml_equal(param[0], left[0])) {
      return /* false */0;
    } else {
      return /* true */1;
    }
  } else if (!left.tag && param[0] === left[0]) {
    return /* true */1;
  } else {
    return /* false */0;
  }
}

function eventHandler_Register(callbacks, elem, name, handlerType) {
  var cb = [eventHandler_GetCB(handlerType)];
  var handler = eventHandler(callbacks, cb);
  addEventListener(elem, name, handler, /* false */0);
  return /* Some */[/* record */[
            /* handler */handler,
            /* cb */cb
          ]];
}

function eventHandler_Unregister(elem, name, param) {
  if (param) {
    removeEventListener(elem, name, param[0][/* handler */0], /* false */0);
    return /* None */0;
  } else {
    return /* None */0;
  }
}

function eventHandler_Mutate(callbacks, elem, oldName, newName, oldHandlerType, newHandlerType, oldCache, newCache) {
  var match = oldCache[0];
  if (match) {
    if (oldName === newName) {
      newCache[0] = oldCache[0];
      if (compareEventHandlerTypes(oldHandlerType, newHandlerType)) {
        return /* () */0;
      } else {
        var cb = eventHandler_GetCB(newHandlerType);
        match[0][/* cb */1][0] = cb;
        return /* () */0;
      }
    } else {
      oldCache[0] = eventHandler_Unregister(elem, oldName, oldCache[0]);
      newCache[0] = eventHandler_Register(callbacks, elem, newName, newHandlerType);
      return /* () */0;
    }
  } else {
    newCache[0] = eventHandler_Register(callbacks, elem, newName, newHandlerType);
    return /* () */0;
  }
}

function patchVNodesOnElems_PropertiesApply_Add(callbacks, elem, _, param) {
  if (typeof param === "number") {
    return /* () */0;
  } else {
    switch (param.tag | 0) {
      case 0 : 
          elem[param[0]] = param[1];
          return /* () */0;
      case 1 : 
          return setAttributeNsOptional(elem, param[0], param[1], param[2]);
      case 2 : 
          console.log(/* tuple */[
                "TODO:  Add Data Unhandled",
                param[0],
                param[1]
              ]);
          throw [
                failure,
                "TODO:  Add Data Unhandled"
              ];
      case 3 : 
          param[2][0] = eventHandler_Register(callbacks, elem, param[0], param[1]);
          return /* () */0;
      case 4 : 
          return fold_left$1((function (_, param) {
                        return setStyleProperty(elem, /* None */0, param[0], param[1]);
                      }), /* () */0, param[0]);
      
    }
  }
}

function patchVNodesOnElems_PropertiesApply_Remove(_, elem, _$1, param) {
  if (typeof param === "number") {
    return /* () */0;
  } else {
    switch (param.tag | 0) {
      case 0 : 
          elem[param[0]] = undefined;
          return /* () */0;
      case 1 : 
          return removeAttributeNsOptional(elem, param[0], param[1]);
      case 2 : 
          console.log(/* tuple */[
                "TODO:  Remove Data Unhandled",
                param[0],
                param[1]
              ]);
          throw [
                failure,
                "TODO:  Remove Data Unhandled"
              ];
      case 3 : 
          var cache = param[2];
          cache[0] = eventHandler_Unregister(elem, param[0], cache[0]);
          return /* () */0;
      case 4 : 
          return fold_left$1((function (_, param) {
                        return setStyleProperty(elem, /* None */0, param[0], null);
                      }), /* () */0, param[0]);
      
    }
  }
}

function patchVNodesOnElems_PropertiesApply_RemoveAdd(callbacks, elem, idx, oldProp, newProp) {
  patchVNodesOnElems_PropertiesApply_Remove(callbacks, elem, idx, oldProp);
  patchVNodesOnElems_PropertiesApply_Add(callbacks, elem, idx, newProp);
  return /* () */0;
}

function patchVNodesOnElems_PropertiesApply_Mutate(_, elem, _$1, oldProp, _newProp) {
  if (typeof _newProp === "number") {
    throw [
          failure,
          "This should never be called as all entries through NoProp are gated."
        ];
  } else {
    switch (_newProp.tag | 0) {
      case 0 : 
          elem[_newProp[0]] = _newProp[1];
          return /* () */0;
      case 1 : 
          return setAttributeNsOptional(elem, _newProp[0], _newProp[1], _newProp[2]);
      case 2 : 
          console.log(/* tuple */[
                "TODO:  Mutate Data Unhandled",
                _newProp[0],
                _newProp[1]
              ]);
          throw [
                failure,
                "TODO:  Mutate Data Unhandled"
              ];
      case 3 : 
          throw [
                failure,
                "This will never be called because it is gated"
              ];
      case 4 : 
          if (typeof oldProp === "number") {
            throw [
                  failure,
                  "Passed a non-Style to a new Style as a Mutations while the old Style is not actually a style!"
                ];
          } else if (oldProp.tag === 4) {
            return fold_left2((function (_, param, param$1) {
                          var nv = param$1[1];
                          var nk = param$1[0];
                          var ok = param[0];
                          if (ok === nk) {
                            if (param[1] === nv) {
                              return /* () */0;
                            } else {
                              return setStyleProperty(elem, /* None */0, nk, nv);
                            }
                          } else {
                            setStyleProperty(elem, /* None */0, ok, null);
                            return setStyleProperty(elem, /* None */0, nk, nv);
                          }
                        }), /* () */0, oldProp[0], _newProp[0]);
          } else {
            throw [
                  failure,
                  "Passed a non-Style to a new Style as a Mutations while the old Style is not actually a style!"
                ];
          }
          break;
      
    }
  }
}

function patchVNodesOnElems_PropertiesApply(callbacks, elem, _idx, _oldProperties, _newProperties) {
  while(true) {
    var newProperties = _newProperties;
    var oldProperties = _oldProperties;
    var idx = _idx;
    if (oldProperties) {
      var _oldProp = oldProperties[0];
      var exit = 0;
      if (newProperties) {
        if (typeof _oldProp === "number") {
          if (typeof newProperties[0] === "number") {
            _newProperties = newProperties[1];
            _oldProperties = oldProperties[1];
            _idx = idx + 1 | 0;
            continue ;
            
          } else {
            exit = 1;
          }
        } else {
          switch (_oldProp.tag | 0) {
            case 0 : 
                var newProp = newProperties[0];
                if (typeof newProp === "number") {
                  exit = 1;
                } else if (newProp.tag) {
                  exit = 1;
                } else {
                  if (!(_oldProp[0] === newProp[0] && _oldProp[1] === newProp[1])) {
                    patchVNodesOnElems_PropertiesApply_Mutate(callbacks, elem, idx, _oldProp, newProp);
                  }
                  _newProperties = newProperties[1];
                  _oldProperties = oldProperties[1];
                  _idx = idx + 1 | 0;
                  continue ;
                  
                }
                break;
            case 1 : 
                var newProp$1 = newProperties[0];
                if (typeof newProp$1 === "number") {
                  exit = 1;
                } else if (newProp$1.tag === 1) {
                  if (!(_oldProp[0] === newProp$1[0] && _oldProp[1] === newProp$1[1] && _oldProp[2] === newProp$1[2])) {
                    patchVNodesOnElems_PropertiesApply_Mutate(callbacks, elem, idx, _oldProp, newProp$1);
                  }
                  _newProperties = newProperties[1];
                  _oldProperties = oldProperties[1];
                  _idx = idx + 1 | 0;
                  continue ;
                  
                } else {
                  exit = 1;
                }
                break;
            case 2 : 
                var newProp$2 = newProperties[0];
                if (typeof newProp$2 === "number") {
                  exit = 1;
                } else if (newProp$2.tag === 2) {
                  if (!(_oldProp[0] === newProp$2[0] && _oldProp[1] === newProp$2[1])) {
                    patchVNodesOnElems_PropertiesApply_Mutate(callbacks, elem, idx, _oldProp, newProp$2);
                  }
                  _newProperties = newProperties[1];
                  _oldProperties = oldProperties[1];
                  _idx = idx + 1 | 0;
                  continue ;
                  
                } else {
                  exit = 1;
                }
                break;
            case 3 : 
                var _newProp = newProperties[0];
                if (typeof _newProp === "number") {
                  exit = 1;
                } else if (_newProp.tag === 3) {
                  eventHandler_Mutate(callbacks, elem, _oldProp[0], _newProp[0], _oldProp[1], _newProp[1], _oldProp[2], _newProp[2]);
                  _newProperties = newProperties[1];
                  _oldProperties = oldProperties[1];
                  _idx = idx + 1 | 0;
                  continue ;
                  
                } else {
                  exit = 1;
                }
                break;
            case 4 : 
                var newProp$3 = newProperties[0];
                if (typeof newProp$3 === "number") {
                  exit = 1;
                } else if (newProp$3.tag === 4) {
                  if (!caml_equal(_oldProp[0], newProp$3[0])) {
                    patchVNodesOnElems_PropertiesApply_Mutate(callbacks, elem, idx, _oldProp, newProp$3);
                  }
                  _newProperties = newProperties[1];
                  _oldProperties = oldProperties[1];
                  _idx = idx + 1 | 0;
                  continue ;
                  
                } else {
                  exit = 1;
                }
                break;
            
          }
        }
      } else {
        return /* false */0;
      }
      if (exit === 1) {
        patchVNodesOnElems_PropertiesApply_RemoveAdd(callbacks, elem, idx, _oldProp, newProperties[0]);
        _newProperties = newProperties[1];
        _oldProperties = oldProperties[1];
        _idx = idx + 1 | 0;
        continue ;
        
      }
      
    } else if (newProperties) {
      return /* false */0;
    } else {
      return /* true */1;
    }
  }
}

function patchVNodesOnElems_Properties(callbacks, elem, oldProperties, newProperties) {
  return patchVNodesOnElems_PropertiesApply(callbacks, elem, 0, oldProperties, newProperties);
}

function patchVNodesOnElems_ReplaceNode(callbacks, elem, elems, idx, param) {
  if (param.tag === 2) {
    var newProperties = param[4];
    var oldChild = caml_array_get(elems, idx);
    var newChild = createElementNsOptional(param[0], param[1]);
    var match = patchVNodesOnElems_Properties(callbacks, newChild, map$2((function () {
                return /* NoProp */0;
              }), newProperties), newProperties);
    if (match !== 0) {
      var childChildren = newChild.childNodes;
      patchVNodesOnElems(callbacks, newChild, childChildren, 0, /* [] */0, param[5]);
      insertBefore(elem, newChild, oldChild);
      elem.removeChild(oldChild);
      return /* () */0;
    } else {
      throw [
            match_failure,
            [
              "/Users/bobbypriambodo/Projects/benar.id/chrome-extension/node_modules/bucklescript-tea/src/vdom.ml",
              316,
              30
            ]
          ];
    }
  } else {
    throw [
          failure,
          "Node replacement should never be passed anything but a node itself"
        ];
  }
}

function patchVNodesOnElems_CreateElement(_callbacks, _param) {
  while(true) {
    var param = _param;
    var callbacks = _callbacks;
    switch (param.tag | 0) {
      case 0 : 
          var text = param[0];
          return document.createComment(text);
      case 1 : 
          var text$1 = param[0];
          return document.createTextNode(text$1);
      case 2 : 
          var newProperties = param[4];
          var newChild = createElementNsOptional(param[0], param[1]);
          var match = patchVNodesOnElems_Properties(callbacks, newChild, map$2((function () {
                      return /* NoProp */0;
                    }), newProperties), newProperties);
          if (match !== 0) {
            var childChildren = newChild.childNodes;
            patchVNodesOnElems(callbacks, newChild, childChildren, 0, /* [] */0, param[5]);
            return newChild;
          } else {
            throw [
                  match_failure,
                  [
                    "/Users/bobbypriambodo/Projects/benar.id/chrome-extension/node_modules/bucklescript-tea/src/vdom.ml",
                    330,
                    30
                  ]
                ];
          }
          break;
      case 3 : 
          var vdom = _1(param[1], /* () */0);
          param[2][0] = vdom;
          _param = vdom;
          continue ;
          case 4 : 
          _param = param[1];
          _callbacks = _1(param[0], callbacks);
          continue ;
          
    }
  }
}

function patchVNodesOnElems_MutateNode(callbacks, elem, elems, idx, oldNode, newNode) {
  if (oldNode.tag === 2) {
    if (newNode.tag === 2) {
      if (oldNode[3] !== newNode[3] || oldNode[1] !== newNode[1]) {
        return patchVNodesOnElems_ReplaceNode(callbacks, elem, elems, idx, newNode);
      } else {
        var child = caml_array_get(elems, idx);
        var childChildren = child.childNodes;
        if (!patchVNodesOnElems_Properties(callbacks, child, oldNode[4], newNode[4])) {
          console.log("VDom:  Failed swapping properties because the property list length changed, use `noProp` to swap properties instead, not by altering the list structure.  This is a massive inefficiency until this issue is resolved.");
          patchVNodesOnElems_ReplaceNode(callbacks, elem, elems, idx, newNode);
        }
        return patchVNodesOnElems(callbacks, child, childChildren, 0, oldNode[5], newNode[5]);
      }
    } else {
      throw [
            failure,
            "Non-node passed to patchVNodesOnElems_MutateNode"
          ];
    }
  } else {
    throw [
          failure,
          "Non-node passed to patchVNodesOnElems_MutateNode"
        ];
  }
}

function patchVNodesOnElems(callbacks, elem, elems, _idx, _oldVNodes, _newVNodes) {
  while(true) {
    var newVNodes = _newVNodes;
    var oldVNodes = _oldVNodes;
    var idx = _idx;
    if (oldVNodes) {
      var oldNode = oldVNodes[0];
      var exit = 0;
      switch (oldNode.tag | 0) {
        case 0 : 
            if (newVNodes) {
              var match = newVNodes[0];
              if (match.tag) {
                exit = 1;
              } else if (oldNode[0] === match[0]) {
                _newVNodes = newVNodes[1];
                _oldVNodes = oldVNodes[1];
                _idx = idx + 1 | 0;
                continue ;
                
              } else {
                exit = 1;
              }
            } else {
              exit = 1;
            }
            break;
        case 1 : 
            if (newVNodes) {
              var match$1 = newVNodes[0];
              if (match$1.tag === 1) {
                var newText = match$1[0];
                if (oldNode[0] !== newText) {
                  var child = caml_array_get(elems, idx);
                  child.nodeValue = newText;
                }
                _newVNodes = newVNodes[1];
                _oldVNodes = oldVNodes[1];
                _idx = idx + 1 | 0;
                continue ;
                
              } else {
                exit = 1;
              }
            } else {
              exit = 1;
            }
            break;
        case 2 : 
            if (newVNodes) {
              var newNode = newVNodes[0];
              if (newNode.tag === 2) {
                var newRest = newVNodes[1];
                var newKey = newNode[2];
                var newTagName = newNode[1];
                var newNamespace = newNode[0];
                var oldRest = oldVNodes[1];
                var oldKey = oldNode[2];
                var oldTagName = oldNode[1];
                var oldNamespace = oldNode[0];
                if (oldKey === newKey && oldKey !== "") {
                  _newVNodes = newRest;
                  _oldVNodes = oldRest;
                  _idx = idx + 1 | 0;
                  continue ;
                  
                } else if (oldKey === "" || newKey === "") {
                  patchVNodesOnElems_MutateNode(callbacks, elem, elems, idx, oldNode, newNode);
                  _newVNodes = newRest;
                  _oldVNodes = oldRest;
                  _idx = idx + 1 | 0;
                  continue ;
                  
                } else {
                  var exit$1 = 0;
                  var exit$2 = 0;
                  if (oldRest) {
                    var match$2 = oldRest[0];
                    if (match$2.tag === 2) {
                      var olderRest = oldRest[1];
                      var olderKey = match$2[2];
                      var olderTagName = match$2[1];
                      var olderNamespace = match$2[0];
                      var exit$3 = 0;
                      if (newRest) {
                        var match$3 = newRest[0];
                        if (match$3.tag === 2) {
                          if (olderNamespace === newNamespace && olderTagName === newTagName && olderKey === newKey && oldNamespace === match$3[0] && oldTagName === match$3[1] && oldKey === match$3[2]) {
                            var firstChild$$1 = caml_array_get(elems, idx);
                            var secondChild = caml_array_get(elems, idx + 1 | 0);
                            elem.removeChild(secondChild);
                            insertBefore(elem, secondChild, firstChild$$1);
                            _newVNodes = newRest[1];
                            _oldVNodes = olderRest;
                            _idx = idx + 2 | 0;
                            continue ;
                            
                          } else {
                            exit$3 = 4;
                          }
                        } else {
                          exit$3 = 4;
                        }
                      } else {
                        exit$3 = 4;
                      }
                      if (exit$3 === 4) {
                        if (olderNamespace === newNamespace && olderTagName === newTagName && olderKey === newKey) {
                          var oldChild = caml_array_get(elems, idx);
                          elem.removeChild(oldChild);
                          _newVNodes = newRest;
                          _oldVNodes = olderRest;
                          _idx = idx + 1 | 0;
                          continue ;
                          
                        } else {
                          exit$2 = 3;
                        }
                      }
                      
                    } else {
                      exit$2 = 3;
                    }
                  } else {
                    exit$2 = 3;
                  }
                  if (exit$2 === 3) {
                    if (newRest) {
                      var match$4 = newRest[0];
                      if (match$4.tag === 2) {
                        if (oldNamespace === match$4[0] && oldTagName === match$4[1] && oldKey === match$4[2]) {
                          var oldChild$1 = caml_array_get(elems, idx);
                          var newChild = patchVNodesOnElems_CreateElement(callbacks, newNode);
                          insertBefore(elem, newChild, oldChild$1);
                          _newVNodes = newRest;
                          _idx = idx + 1 | 0;
                          continue ;
                          
                        } else {
                          exit$1 = 2;
                        }
                      } else {
                        exit$1 = 2;
                      }
                    } else {
                      exit$1 = 2;
                    }
                  }
                  if (exit$1 === 2) {
                    patchVNodesOnElems_MutateNode(callbacks, elem, elems, idx, oldNode, newNode);
                    _newVNodes = newRest;
                    _oldVNodes = oldRest;
                    _idx = idx + 1 | 0;
                    continue ;
                    
                  }
                  
                }
              } else {
                exit = 1;
              }
            } else {
              exit = 1;
            }
            break;
        case 3 : 
            if (newVNodes) {
              var match$5 = newVNodes[0];
              if (match$5.tag === 3) {
                var newRest$1 = newVNodes[1];
                var newCache = match$5[2];
                var newGen = match$5[1];
                var newKey$1 = match$5[0];
                var oldRest$1 = oldVNodes[1];
                var oldCache = oldNode[2];
                var oldKey$1 = oldNode[0];
                if (oldKey$1 === newKey$1) {
                  newCache[0] = oldCache[0];
                  _newVNodes = newRest$1;
                  _oldVNodes = oldRest$1;
                  _idx = idx + 1 | 0;
                  continue ;
                  
                } else {
                  var exit$4 = 0;
                  var exit$5 = 0;
                  if (oldRest$1) {
                    var match$6 = oldRest$1[0];
                    if (match$6.tag === 3) {
                      var olderRest$1 = oldRest$1[1];
                      var olderKey$1 = match$6[0];
                      var exit$6 = 0;
                      if (newRest$1) {
                        var match$7 = newRest$1[0];
                        if (match$7.tag === 3) {
                          if (olderKey$1 === newKey$1 && oldKey$1 === match$7[0]) {
                            var firstChild$1 = caml_array_get(elems, idx);
                            var secondChild$1 = caml_array_get(elems, idx + 1 | 0);
                            elem.removeChild(secondChild$1);
                            insertBefore(elem, secondChild$1, firstChild$1);
                            _newVNodes = newRest$1[1];
                            _oldVNodes = olderRest$1;
                            _idx = idx + 2 | 0;
                            continue ;
                            
                          } else {
                            exit$6 = 4;
                          }
                        } else {
                          exit$6 = 4;
                        }
                      } else {
                        exit$6 = 4;
                      }
                      if (exit$6 === 4) {
                        if (olderKey$1 === newKey$1) {
                          var oldChild$2 = caml_array_get(elems, idx);
                          elem.removeChild(oldChild$2);
                          var oldVdom = match$6[2][0];
                          newCache[0] = oldVdom;
                          _newVNodes = newRest$1;
                          _oldVNodes = olderRest$1;
                          _idx = idx + 1 | 0;
                          continue ;
                          
                        } else {
                          exit$5 = 3;
                        }
                      }
                      
                    } else {
                      exit$5 = 3;
                    }
                  } else {
                    exit$5 = 3;
                  }
                  if (exit$5 === 3) {
                    if (newRest$1) {
                      var match$8 = newRest$1[0];
                      if (match$8.tag === 3) {
                        if (match$8[0] === oldKey$1) {
                          var oldChild$3 = caml_array_get(elems, idx);
                          var newVdom = _1(newGen, /* () */0);
                          newCache[0] = newVdom;
                          var newChild$1 = patchVNodesOnElems_CreateElement(callbacks, newVdom);
                          insertBefore(elem, newChild$1, oldChild$3);
                          _newVNodes = newRest$1;
                          _idx = idx + 1 | 0;
                          continue ;
                          
                        } else {
                          exit$4 = 2;
                        }
                      } else {
                        exit$4 = 2;
                      }
                    } else {
                      exit$4 = 2;
                    }
                  }
                  if (exit$4 === 2) {
                    var oldVdom$1 = oldCache[0];
                    var newVdom$1 = _1(newGen, /* () */0);
                    newCache[0] = newVdom$1;
                    _newVNodes = /* :: */[
                      newVdom$1,
                      newRest$1
                    ];
                    _oldVNodes = /* :: */[
                      oldVdom$1,
                      oldRest$1
                    ];
                    continue ;
                    
                  }
                  
                }
              } else {
                exit = 1;
              }
            } else {
              exit = 1;
            }
            break;
        case 4 : 
            _oldVNodes = /* :: */[
              oldNode[1],
              oldVNodes[1]
            ];
            continue ;
            
      }
      if (exit === 1) {
        var oldRest$2 = oldVNodes[1];
        if (newVNodes) {
          var newNode$1 = newVNodes[0];
          if (newNode$1.tag === 4) {
            patchVNodesOnElems(_1(newNode$1[0], callbacks), elem, elems, idx, /* :: */[
                  oldNode,
                  /* [] */0
                ], /* :: */[
                  newNode$1[1],
                  /* [] */0
                ]);
            _newVNodes = newVNodes[1];
            _oldVNodes = oldRest$2;
            _idx = idx + 1 | 0;
            continue ;
            
          } else {
            var oldChild$4 = caml_array_get(elems, idx);
            var newChild$2 = patchVNodesOnElems_CreateElement(callbacks, newNode$1);
            insertBefore(elem, newChild$2, oldChild$4);
            elem.removeChild(oldChild$4);
            _newVNodes = newVNodes[1];
            _oldVNodes = oldRest$2;
            _idx = idx + 1 | 0;
            continue ;
            
          }
        } else {
          var child$1 = caml_array_get(elems, idx);
          elem.removeChild(child$1);
          _newVNodes = /* [] */0;
          _oldVNodes = oldRest$2;
          continue ;
          
        }
      }
      
    } else if (newVNodes) {
      var newChild$3 = patchVNodesOnElems_CreateElement(callbacks, newVNodes[0]);
      elem.appendChild(newChild$3);
      _newVNodes = newVNodes[1];
      _oldVNodes = /* [] */0;
      _idx = idx + 1 | 0;
      continue ;
      
    } else {
      return /* () */0;
    }
  }
}

function patchVNodesIntoElement(callbacks, elem, oldVNodes, newVNodes) {
  var elems = elem.childNodes;
  patchVNodesOnElems(callbacks, elem, elems, 0, oldVNodes, newVNodes);
  return newVNodes;
}


/* No side effect */

// Generated by BUCKLESCRIPT VERSION 1.8.2, PLEASE EDIT WITH CARE
function run(callbacks, param) {
  if (typeof param === "number") {
    return /* () */0;
  } else {
    switch (param.tag | 0) {
      case 1 : 
          return fold_left$1((function (_, cmd) {
                        return run(callbacks, cmd);
                      }), /* () */0, param[0]);
      case 0 : 
      case 2 : 
          return _1(param[0], callbacks);
      
    }
  }
}


/* No side effect */

// Generated by BUCKLESCRIPT VERSION 1.8.2, PLEASE EDIT WITH CARE
function run$1(oldCallbacks, newCallbacks, oldSub, newSub) {
  var enable = function (_callbacks, _param) {
    while(true) {
      var param = _param;
      var callbacks = _callbacks;
      if (typeof param === "number") {
        return /* () */0;
      } else {
        switch (param.tag | 0) {
          case 0 : 
              var subs = param[0];
              if (subs) {
                return iter$1((function(callbacks){
                          return function (param) {
                            return enable(callbacks, param);
                          }
                          }(callbacks)), subs);
              } else {
                return /* () */0;
              }
          case 1 : 
              param[2][0] = /* Some */[_1(param[1], callbacks)];
              return /* () */0;
          case 2 : 
              var subCallbacks = _1(param[0], callbacks);
              _param = param[1];
              _callbacks = subCallbacks;
              continue ;
              
        }
      }
    }
  };
  var disable = function (_callbacks, _param) {
    while(true) {
      var param = _param;
      var callbacks = _callbacks;
      if (typeof param === "number") {
        return /* () */0;
      } else {
        switch (param.tag | 0) {
          case 0 : 
              var subs = param[0];
              if (subs) {
                return iter$1((function(callbacks){
                          return function (param) {
                            return disable(callbacks, param);
                          }
                          }(callbacks)), subs);
              } else {
                return /* () */0;
              }
          case 1 : 
              var diCB = param[2];
              var match = diCB[0];
              if (match) {
                diCB[0] = /* None */0;
                return _1(match[0], /* () */0);
              } else {
                return /* () */0;
              }
          case 2 : 
              var subCallbacks = _1(param[0], callbacks);
              _param = param[1];
              _callbacks = subCallbacks;
              continue ;
              
        }
      }
    }
  };
  var exit = 0;
  if (typeof oldSub === "number") {
    if (typeof newSub === "number") {
      return newSub;
    } else {
      exit = 1;
    }
  } else {
    switch (oldSub.tag | 0) {
      case 0 : 
          if (typeof newSub === "number") {
            exit = 1;
          } else if (newSub.tag) {
            exit = 1;
          } else {
            var aux = function (_oldList, _newList) {
              while(true) {
                var newList = _newList;
                var oldList = _oldList;
                if (oldList) {
                  var oldRest = oldList[1];
                  var oldSubSub = oldList[0];
                  if (newList) {
                    run$1(oldCallbacks, newCallbacks, oldSubSub, newList[0]);
                    _newList = newList[1];
                    _oldList = oldRest;
                    continue ;
                    
                  } else {
                    disable(oldCallbacks, oldSubSub);
                    _newList = /* [] */0;
                    _oldList = oldRest;
                    continue ;
                    
                  }
                } else if (newList) {
                  enable(newCallbacks, newList[0]);
                  _newList = newList[1];
                  _oldList = /* [] */0;
                  continue ;
                  
                } else {
                  return /* () */0;
                }
              }
            };
            aux(oldSub[0], newSub[0]);
            return newSub;
          }
          break;
      case 1 : 
          if (typeof newSub === "number") {
            exit = 1;
          } else if (newSub.tag === 1) {
            if (oldSub[0] === newSub[0]) {
              newSub[2][0] = oldSub[2][0];
              return newSub;
            } else {
              exit = 1;
            }
          } else {
            exit = 1;
          }
          break;
      case 2 : 
          if (typeof newSub === "number") {
            exit = 1;
          } else if (newSub.tag === 2) {
            var olderCallbacks = _1(oldSub[0], oldCallbacks);
            var newerCallbacks = _1(newSub[0], newCallbacks);
            run$1(olderCallbacks, newerCallbacks, oldSub[1], newSub[1]);
            return newSub;
          } else {
            exit = 1;
          }
          break;
      
    }
  }
  if (exit === 1) {
    disable(oldCallbacks, oldSub);
    enable(newCallbacks, newSub);
    return newSub;
  }
  
}


/* No side effect */

function null_undefined_to_opt(x) {
  if (x === null || x === undefined) {
    return /* None */0;
  } else {
    return /* Some */[x];
  }
}


/* No side effect */

// Generated by BUCKLESCRIPT VERSION 1.8.2, PLEASE EDIT WITH CARE
function programStateWrapper(initModel, pump, shutdown) {
  var model = [initModel];
  var callbacks = [/* record */[/* enqueue */(function () {
          console.log("INVALID enqueue CALL!");
          return /* () */0;
        })]];
  var pumperInterface = _1(pump, callbacks);
  var pending = [/* None */0];
  var handler = function (msg$$1) {
    var match = pending[0];
    if (match) {
      pending[0] = /* Some */[/* :: */[
          msg$$1,
          match[0]
        ]];
      return /* () */0;
    } else {
      pending[0] = /* Some */[/* [] */0];
      var newModel = _2(pumperInterface[/* handleMsg */1], model[0], msg$$1);
      model[0] = newModel;
      var match$1 = pending[0];
      if (match$1) {
        var msgs = match$1[0];
        if (msgs) {
          pending[0] = /* None */0;
          return iter$1(handler, rev(msgs));
        } else {
          pending[0] = /* None */0;
          return /* () */0;
        }
      } else {
        throw [
              failure,
              "INVALID message queue state, should never be None during message processing!"
            ];
      }
    }
  };
  var finalizedCBs = /* record */[/* enqueue */handler];
  callbacks[0] = finalizedCBs;
  var pi_requestShutdown = function () {
    callbacks[0] = /* record */[/* enqueue */(function () {
          console.log("INVALID message enqueued when shut down");
          return /* () */0;
        })];
    var cmd = _1(shutdown, model[0]);
    _1(pumperInterface[/* shutdown */2], cmd);
    return /* () */0;
  };
  _1(pumperInterface[/* startup */0], /* () */0);
  return {
          pushMsg: handler,
          shutdown: pi_requestShutdown
        };
}

function programLoop(update, view, subscriptions, initModel, initCmd, param) {
  if (param) {
    var parentNode = param[0];
    return (function (callbacks) {
        var priorRenderedVdom = [/* [] */0];
        var latestModel = [initModel];
        var nextFrameID = [/* None */0];
        var doRender = function () {
          var match = nextFrameID[0];
          if (match) {
            var newVdom_000 = _1(view, latestModel[0]);
            var newVdom = /* :: */[
              newVdom_000,
              /* [] */0
            ];
            var justRenderedVdom = patchVNodesIntoElement(callbacks, parentNode, priorRenderedVdom[0], newVdom);
            priorRenderedVdom[0] = justRenderedVdom;
            nextFrameID[0] = /* None */0;
            return /* () */0;
          } else {
            return /* () */0;
          }
        };
        var scheduleRender = function () {
          var match = nextFrameID[0];
          if (match) {
            return /* () */0;
          } else {
            nextFrameID[0] = /* Some */[-1];
            return doRender(16);
          }
        };
        var clearPnode = function () {
          while(parentNode.childNodes.length > 0) {
            var match = parentNode.firstChild;
            if (match !== null) {
              parentNode.removeChild(match);
            }
            
          }
          return /* () */0;
        };
        var oldSub = [/* NoSub */0];
        var handleSubscriptionChange = function (model) {
          var newSub = _1(subscriptions, model);
          oldSub[0] = run$1(callbacks, callbacks, oldSub[0], newSub);
          return /* () */0;
        };
        var handlerStartup = function () {
          clearPnode(/* () */0);
          run(callbacks, initCmd);
          handleSubscriptionChange(latestModel[0]);
          nextFrameID[0] = /* Some */[-1];
          doRender(16);
          return /* () */0;
        };
        var handler = function (model, msg$$1) {
          var match = _2(update, model, msg$$1);
          var newModel = match[0];
          latestModel[0] = newModel;
          run(callbacks, match[1]);
          scheduleRender(/* () */0);
          handleSubscriptionChange(newModel);
          return newModel;
        };
        var handlerShutdown = function (cmd) {
          nextFrameID[0] = /* None */0;
          run(callbacks, cmd);
          oldSub[0] = run$1(callbacks, callbacks, oldSub[0], /* NoSub */0);
          priorRenderedVdom[0] = /* [] */0;
          clearPnode(/* () */0);
          return /* () */0;
        };
        return /* record */[
                /* startup */handlerStartup,
                /* handleMsg */handler,
                /* shutdown */handlerShutdown
              ];
      });
  } else {
    return (function (callbacks) {
        var oldSub = [/* NoSub */0];
        var handleSubscriptionChange = function (model) {
          var newSub = _1(subscriptions, model);
          oldSub[0] = run$1(callbacks, callbacks, oldSub[0], newSub);
          return /* () */0;
        };
        return /* record */[
                /* startup */(function () {
                    run(callbacks, initCmd);
                    handleSubscriptionChange(initModel);
                    return /* () */0;
                  }),
                /* handleMsg */(function (model, msg$$1) {
                    var match = _2(update, model, msg$$1);
                    var newModel = match[0];
                    run(callbacks, match[1]);
                    handleSubscriptionChange(newModel);
                    return newModel;
                  }),
                /* shutdown */(function (cmd) {
                    run(callbacks, cmd);
                    oldSub[0] = run$1(callbacks, callbacks, oldSub[0], /* NoSub */0);
                    return /* () */0;
                  })
              ];
      });
  }
}

function program(param, pnode, flags) {
  polyfills(/* () */0);
  var match = _1(param[/* init */0], flags);
  var initModel = match[0];
  var opnode = null_undefined_to_opt(pnode);
  var pumpInterface = programLoop(param[/* update */1], param[/* view */2], param[/* subscriptions */3], initModel, match[1], opnode);
  return programStateWrapper(initModel, pumpInterface, param[/* shutdown */4]);
}

function standardProgram(param, pnode, args) {
  return program(/* record */[
              /* init */param[/* init */0],
              /* update */param[/* update */1],
              /* view */param[/* view */2],
              /* subscriptions */param[/* subscriptions */3],
              /* shutdown */(function () {
                  return /* NoCmd */0;
                })
            ], pnode, args);
}


/* No side effect */

// Generated by BUCKLESCRIPT VERSION 1.8.2, PLEASE EDIT WITH CARE
function text$1(str) {
  return /* Text */__(1, [str]);
}

function div$2($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return fullnode("", "div", key, unique, props, nodes);
}

function span($staropt$star, $staropt$star$1, props, nodes) {
  var key = $staropt$star ? $staropt$star[0] : "";
  var unique = $staropt$star$1 ? $staropt$star$1[0] : "";
  return fullnode("", "span", key, unique, props, nodes);
}

function class$prime(name) {
  return /* RawProp */__(0, [
            "className",
            name
          ]);
}

var style$2 = style;


/* No side effect */

// Generated by BUCKLESCRIPT VERSION 1.8.2, PLEASE EDIT WITH CARE
function init(flags) {
  var model_000 = /* data */flags[/* data */0];
  var model_001 = /* user */flags[/* user */1];
  var model = /* record */[
    model_000,
    model_001,
    /* show_form : false */0
  ];
  return /* tuple */[
          model,
          /* NoCmd */0
        ];
}

function update(model, _) {
  return /* tuple */[
          model,
          /* NoCmd */0
        ];
}

function calculate_percentage(count, divider) {
  if (divider <= 0) {
    return 0.0;
  } else {
    var raw_percentage = 100.0 * (count / divider);
    return (raw_percentage * 100.0 | 0) / 100.0;
  }
}

function get_color(percentage) {
  if (percentage < 50.0) {
    return "red";
  } else {
    return "green";
  }
}

function render_rating(rating) {
  var percentage = calculate_percentage(rating.sum, rating.count);
  return div$2(/* None */0, /* None */0, /* :: */[
              class$prime("benarid-chromeextension-badge-content__rating"),
              /* [] */0
            ], /* :: */[
              div$2(/* None */0, /* None */0, /* :: */[
                    class$prime("benarid-chromeextension-badge-content__header"),
                    /* [] */0
                  ], /* :: */[
                    text$1(rating.label),
                    /* :: */[
                      span(/* None */0, /* None */0, /* :: */[
                            class$prime("benarid-count"),
                            /* [] */0
                          ], /* :: */[
                            text$1(string_of_float(percentage) + "% "),
                            /* :: */[
                              span(/* None */0, /* None */0, /* :: */[
                                    class$prime("benarid-divider"),
                                    /* [] */0
                                  ], /* :: */[
                                    text$1("(" + (string_of_int(rating.count) + " votes)")),
                                    /* [] */0
                                  ]),
                              /* [] */0
                            ]
                          ]),
                      /* [] */0
                    ]
                  ]),
              /* :: */[
                div$2(/* None */0, /* None */0, /* :: */[
                      class$prime("benarid-chromeextension-badge-content__value"),
                      /* [] */0
                    ], /* :: */[
                      div$2(/* None */0, /* None */0, /* :: */[
                            class$prime("benarid-rating-bar benarid-" + get_color(percentage)),
                            /* :: */[
                              style$2("width", string_of_float(percentage) + "%"),
                              /* [] */0
                            ]
                          ], /* [] */0),
                      /* [] */0
                    ]),
                /* [] */0
              ]
            ]);
}

function render_ratings(ratings) {
  return div$2(/* None */0, /* None */0, /* :: */[
              class$prime("benarid-chromeextension-badge-content__ratings"),
              /* [] */0
            ], to_list(map(render_rating, ratings)));
}

function view(model) {
  var match = model[/* show_form */2];
  return div$2(/* None */0, /* None */0, /* [] */0, /* :: */[
              match !== 0 ? (div$2(/* None */0, /* None */0, /* [] */0, /* [] */0), div$2(/* None */0, /* None */0, /* :: */[
                        class$prime("benarid-chromeextension-badge-content__loggedin-message"),
                        /* [] */0
                      ], /* :: */[
                        div$2(/* None */0, /* None */0, /* [] */0, /* [] */0),
                        /* [] */0
                      ])) : render_ratings(model[/* data */0].rating),
              /* [] */0
            ]);
}

function subscriptions() {
  return /* NoSub */0;
}

var partial_arg = /* record */[
  /* init */init,
  /* update */update,
  /* view */view,
  /* subscriptions */subscriptions
];

function main(param, param$1) {
  return standardProgram(partial_arg, param, param$1);
}


/* No side effect */

exports.init = init;
exports.update = update;
exports.calculate_percentage = calculate_percentage;
exports.get_color = get_color;
exports.render_rating = render_rating;
exports.render_ratings = render_ratings;
exports.view = view;
exports.subscriptions = subscriptions;
exports.main = main;

return exports;

}({}));
