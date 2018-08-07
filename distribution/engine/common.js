
// This is a set of useful command some of which are direct PHP copys

function validMac(testStr) 
{
	var regex = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/;
	return regex.test(testStr);
};

function strpos(haystack, needle, offset) {
  //  discuss at: http://phpjs.org/functions/strpos/
  // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Onno Marsman
  // improved by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Daniel Esteban
  //   example 1: strpos('Kevin van Zonneveld', 'e', 5);
  //   returns 1: 14

  var i = (haystack + '')
    .indexOf(needle, (offset || 0));
  return i === -1 ? false : i;
}

function str_replace(search, replace, subject, count) {
  //  discuss at: http://phpjs.org/functions/str_replace/
  // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Gabriel Paderni
  // improved by: Philip Peterson
  // improved by: Simon Willison (http://simonwillison.net)
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Onno Marsman
  // improved by: Brett Zamir (http://brett-zamir.me)
  //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // bugfixed by: Anton Ongson
  // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // bugfixed by: Oleg Eremeev
  //    input by: Onno Marsman
  //    input by: Brett Zamir (http://brett-zamir.me)
  //    input by: Oleg Eremeev
  //        note: The count parameter must be passed as a string in order
  //        note: to find a global variable in which the result will be given
  //   example 1: str_replace(' ', '.', 'Kevin van Zonneveld');
  //   returns 1: 'Kevin.van.Zonneveld'
  //   example 2: str_replace(['{name}', 'l'], ['hello', 'm'], '{name}, lars');
  //   returns 2: 'hemmo, mars'

  var i = 0,
    j = 0,
    temp = '',
    repl = '',
    sl = 0,
    fl = 0,
    f = [].concat(search),
    r = [].concat(replace),
    s = subject,
    ra = Object.prototype.toString.call(r) === '[object Array]',
    sa = Object.prototype.toString.call(s) === '[object Array]';
  s = [].concat(s);
  if (count) {
    this.window[count] = 0;
  }

  for (i = 0, sl = s.length; i < sl; i++) {
    if (s[i] === '') {
      continue;
    }
    for (j = 0, fl = f.length; j < fl; j++) {
      temp = s[i] + '';
      repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
      s[i] = (temp)
        .split(f[j])
        .join(repl);
      if (count && s[i] !== temp) {
        this.window[count] += (temp.length - s[i].length) / f[j].length;
      }
    }
  }
  return sa ? s : s[0];
}

function stripos(f_haystack, f_needle, f_offset) {
	//  discuss at: http://phpjs.org/functions/stripos/
	// original by: Martijn Wieringa
	//  revised by: Onno Marsman
	//   example 1: stripos('ABC', 'a');
	//   returns 1: 0

	var haystack = (f_haystack + '')
	.toLowerCase();
	var needle = (f_needle + '')
	.toLowerCase();
	var index = 0;

	if ((index = haystack.indexOf(needle, f_offset)) !== -1) {
		return index;
	}
	return false;
};
		
function strlen($t)
{
    return $t.length;
};

function array_sum(array) {
	//  discuss at: http://phpjs.org/functions/array_sum/
	// original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// bugfixed by: Nate
	// bugfixed by: Gilbert
	// improved by: David Pilia (http://www.beteck.it/)
	// improved by: Brett Zamir (http://brett-zamir.me)
	//   example 1: array_sum([4, 9, 182.6]);
	//   returns 1: 195.6
	//   example 2: total = []; index = 0.1; for (y=0; y < 12; y++){total[y] = y + index;}
	//   example 2: array_sum(total);
	//   returns 2: 67.2

	var key, sum = 0;

	if (array && typeof array === 'object' && array.change_key_case) { // Duck-type check for our own array()-created PHPJS_Array
		return array.sum.apply(array, Array.prototype.slice.call(arguments, 0));
	}

	// input sanitation
	if (typeof array !== 'object') {
		return null;
	}

	for (key in array) {
		if (!isNaN(parseFloat(array[key]))) {
			sum += parseFloat(array[key]);
		}
	}

	return sum;
}

var str_pad = function(input, pad_length, pad_string, pad_type) {
	//  discuss at: http://phpjs.org/functions/str_pad/
	// original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: Michael White (http://getsprink.com)
	//    input by: Marco van Oort
	// bugfixed by: Brett Zamir (http://brett-zamir.me)
	//   example 1: str_pad('Kevin van Zonneveld', 30, '-=', 'STR_PAD_LEFT');
	//   returns 1: '-=-=-=-=-=-Kevin van Zonneveld'
	//   example 2: str_pad('Kevin van Zonneveld', 30, '-', 'STR_PAD_BOTH');
	//   returns 2: '------Kevin van Zonneveld-----'

	var half = '',
	pad_to_go;

	var str_pad_repeater = function(s, len) {
		var collect = '',
		i;

		while (collect.length < len) {
			collect += s;
		}
		collect = collect.substr(0, len);

		return collect;
	};

	input += '';
	pad_string = pad_string !== undefined ? pad_string : ' ';

	if (pad_type !== 'STR_PAD_LEFT' && pad_type !== 'STR_PAD_RIGHT' && pad_type !== 'STR_PAD_BOTH') {
		pad_type = 'STR_PAD_RIGHT';
	}
	if ((pad_to_go = pad_length - input.length) > 0) {
		if (pad_type === 'STR_PAD_LEFT') {
			input = str_pad_repeater(pad_string, pad_to_go) + input;
		} else if (pad_type === 'STR_PAD_RIGHT') {
			input = input + str_pad_repeater(pad_string, pad_to_go);
		} else if (pad_type === 'STR_PAD_BOTH') {
			half = str_pad_repeater(pad_string, Math.ceil(pad_to_go / 2));
			input = half + input + half;
			input = input.substr(0, pad_length);
		}
	}

	return input;
};

function str_ireplace(search, replace, subject, count) {
	//  discuss at: http://phpjs.org/functions/str_ireplace/
	// original by: Glen Arason (http://CanadianDomainRegistry.ca)
	//        note: Case-insensitive version of str_replace()
	//        note: Compliant with PHP 5.0 str_ireplace() Full details at:
	//        note: http://ca3.php.net/manual/en/function.str-ireplace.php
	//        note: The count parameter (optional) if used must be passed in as a
	//        note: string. eg global var MyCount:
	//        note: str_ireplace($search, $replace, $subject, 'MyCount');
	//      format: str_ireplace($search, $replace, $subject[, 'count'])
	//       input: str_ireplace($search, $replace, $subject[, {string}]);

	var i = 0,
	j = 0,
	temp = '',
	repl = '',
	sl = 0,
	fl = 0,
	f = '',
	r = '',
	s = '',
	ra = '',
	sa = '',
	otemp = '',
	oi = '',
	ofjl = '',
	os = subject,
	osa = Object.prototype.toString.call(os) === '[object Array]';

	if (typeof (search) === 'object') {
		temp = search;
		search = new Array();
		for (i = 0; i < temp.length; i += 1) {
			search[i] = temp[i].toLowerCase();
		}
	} else {
		search = search.toLowerCase();
	}

	if (typeof (subject) === 'object') {
		temp = subject;
		subject = new Array();
		for (i = 0; i < temp.length; i += 1) {
			subject[i] = temp[i].toLowerCase();
		}
	} else {
		subject = subject.toLowerCase();
	}

	if (typeof (search) === 'object' && typeof (replace) === 'string') {
		temp = replace;
		replace = new Array();
		for (i = 0; i < search.length; i += 1) {
			replace[i] = temp;
		}
	}

	temp = '';
	f = [].concat(search);
	r = [].concat(replace);
	ra = Object.prototype.toString.call(r) === '[object Array]';
	s = subject;
	sa = Object.prototype.toString.call(s) === '[object Array]';
	s = [].concat(s);
	os = [].concat(os);

	if (count) {
		this.window[count] = 0;
	}

	for (i = 0, sl = s.length; i < sl; i++) {
		if (s[i] === '') {
			continue;
		}
		for (j = 0, fl = f.length; j < fl; j++) {
			temp = s[i] + '';
			repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
			s[i] = (temp)
			.split(f[j])
			.join(repl);
			otemp = os[i] + '';
			oi = temp.indexOf(f[j]);
			ofjl = f[j].length;
			if (oi >= 0) {
				os[i] = (otemp)
				.split(otemp.substr(oi, ofjl))
				.join(repl);
			}

			if (count) {
				this.window[count] += ((temp.split(f[j]))
				.length - 1);
			}
		}
	}
	return osa ? os : os[0];
}

function html_entity_decode(str) 
{
	return $("<div />").html(str).text();
};			

function html_entity_encode(str) 
{
	return $("<div />").text(str).html();
};			

function money(val)
{
	var ret = "";
	val = parseFloat(val);
	if(isNaN(val)) val = 0;
	var cur = html_entity_decode(core.preferences.currency);
	if(val < 0) ret = "-" + cur;
	else ret = cur;
	ret += Math.abs(val).toFixed(2);
	return ret;
};			

function json_to_array(json)
{
    var params = []
    
    for(var key in json) params[key] = json[key];
    return params;
}

function json_decode(str_json) {
  //       discuss at: http://phpjs.org/functions/json_decode/
  //      original by: Public Domain (http://www.json.org/json2.js)
  // reimplemented by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //      improved by: T.J. Leahy
  //      improved by: Michael White
  //        example 1: json_decode('[ 1 ]');
  //        returns 1: [1]

  /*
       http://www.JSON.org/json2.js
       2008-11-19
       Public Domain.
       NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
       See http://www.JSON.org/js.html
     */

  var json = this.window.JSON;
  if (typeof json === 'object' && typeof json.parse === 'function') {
    try {
      return json.parse(str_json);
    } catch (err) {
      if (!(err instanceof SyntaxError)) {
        throw new Error('Unexpected error type in json_decode()');
      }
      this.php_js = this.php_js || {};
      // usable by json_last_error()
      this.php_js.last_error_json = 4;
      return null;
    }
  }

  var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
  var j;
  var text = str_json;

  // Parsing happens in four stages. In the first stage, we replace certain
  // Unicode characters with escape sequences. JavaScript handles many characters
  // incorrectly, either silently deleting them, or treating them as line endings.
  cx.lastIndex = 0;
  if (cx.test(text)) {
    text = text.replace(cx, function(a) {
      return '\\u' + ('0000' + a.charCodeAt(0)
          .toString(16))
        .slice(-4);
    });
  }

  // In the second stage, we run the text against regular expressions that look
  // for non-JSON patterns. We are especially concerned with '()' and 'new'
  // because they can cause invocation, and '=' because it can cause mutation.
  // But just to be safe, we want to reject all unexpected forms.
  // We split the second stage into 4 regexp operations in order to work around
  // crippling inefficiencies in IE's and Safari's regexp engines. First we
  // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
  // replace all simple value tokens with ']' characters. Third, we delete all
      // open brackets that follow a colon or comma or that begin the text. Finally,
      // we look to see that the remaining characters are only whitespace or ']' or
  // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
  if ((/^[\],:{}\s]*$/)
    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
      .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
      .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

    // In the third stage we use the eval function to compile the text into a
    // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
    // in JavaScript: it can begin a block or an object literal. We wrap the text
    // in parens to eliminate the ambiguity.
    j = eval('(' + text + ')');

    return j;
  }

  this.php_js = this.php_js || {};
  // usable by json_last_error()
  this.php_js.last_error_json = 4;
  return null;
}
function json_encode(json)
{
    return idev.utils.JSON2string(json);
}

function array_search(needle, haystack, argStrict) {
  //  discuss at: http://phpjs.org/functions/array_search/
  // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //    input by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //  depends on: array
  //        test: skip
  //   example 1: array_search('zonneveld', {firstname: 'kevin', middle: 'van', surname: 'zonneveld'});
  //   returns 1: 'surname'
  //   example 2: ini_set('phpjs.return_phpjs_arrays', 'on');
  //   example 2: var ordered_arr = array({3:'value'}, {2:'value'}, {'a':'value'}, {'b':'value'});
  //   example 2: var key = array_search(/val/g, ordered_arr); // or var key = ordered_arr.search(/val/g);
  //   returns 2: '3'

  var strict = !!argStrict,
    key = '';

  if (haystack && typeof haystack === 'object' && haystack.change_key_case) {
    // Duck-type check for our own array()-created PHPJS_Array
    return haystack.search(needle, argStrict);
  }
  if (typeof needle === 'object' && needle.exec) {
    // Duck-type for RegExp
    if (!strict) {
      // Let's consider case sensitive searches as strict
      var flags = 'i' + (needle.global ? 'g' : '') +
        (needle.multiline ? 'm' : '') +
        // sticky is FF only
        (needle.sticky ? 'y' : '');
      needle = new RegExp(needle.source, flags);
    }
    for (key in haystack) {
      if (haystack.hasOwnProperty(key)) {
        if (needle.test(haystack[key])) {
          return key;
        }
      }
    }
    return false;
  }

  for (key in haystack) {
    if (haystack.hasOwnProperty(key)) {
      if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
        return key;
      }
    }
  }

  return false;
}

function count(mixed_var, mode) {
  //  discuss at: http://phpjs.org/functions/count/
  // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //    input by: Waldo Malqui Silva (http://waldo.malqui.info)
  //    input by: merabi
  // bugfixed by: Soren Hansen
  // bugfixed by: Olivier Louvignes (http://mg-crea.com/)
  // improved by: Brett Zamir (http://brett-zamir.me)
  //   example 1: count([[0,0],[0,-4]], 'COUNT_RECURSIVE');
  //   returns 1: 6
  //   example 2: count({'one' : [1,2,3,4,5]}, 'COUNT_RECURSIVE');
  //   returns 2: 6

  var key, cnt = 0;

  if (mixed_var === null || typeof mixed_var === 'undefined') {
    return 0;
  } else if (mixed_var.constructor !== Array && mixed_var.constructor !== Object) {
    return 1;
  }

  if (mode === 'COUNT_RECURSIVE') {
    mode = 1;
  }
  if (mode != 1) {
    mode = 0;
  }

  for (key in mixed_var) {
    if (mixed_var.hasOwnProperty(key)) {
      cnt++;
      if (mode == 1 && mixed_var[key] && (mixed_var[key].constructor === Array || mixed_var[key].constructor ===
          Object)) {
        cnt += this.count(mixed_var[key], 1);
      }
    }
  }

  return cnt;
}

function urldecode(str)
{
    return idev.utils.urldecode(str);
}

function array() {
  //  discuss at: http://phpjs.org/functions/array/
  // original by: d3x
  // improved by: Brett Zamir (http://brett-zamir.me)
  //        test: skip
  //   example 1: array('Kevin', 'van', 'Zonneveld');
  //   returns 1: ['Kevin', 'van', 'Zonneveld']
  //   example 2: ini_set('phpjs.return_phpjs_arrays', 'on');
  //   example 2: array({0:2}, {a:41}, {2:3}).change_key_case('CASE_UPPER').keys();
  //   returns 2: [0,'A',2]

  try {
    this.php_js = this.php_js || {};
  } catch (e) {
    this.php_js = {};
  }

  var arrInst, e, __, that = this,
    PHPJS_Array = function PHPJS_Array() {};
  mainArgs = arguments, p = this.php_js,
    _indexOf = function(value, from, strict) {
      var i = from || 0,
        nonstrict = !strict,
        length = this.length;
      while (i < length) {
        if (this[i] === value || (nonstrict && this[i] == value)) {
          return i;
        }
        i++;
      }
      return -1;
    };
  // BEGIN REDUNDANT
  if (!p.Relator) {
    p.Relator = (function() {
      // Used this functional class for giving privacy to the class we are creating
      // Code adapted from http://www.devpro.it/code/192.html
      // Relator explained at http://webreflection.blogspot.com/2008/07/javascript-relator-object-aka.html
      // Its use as privacy technique described at http://webreflection.blogspot.com/2008/10/new-relator-object-plus-unshared.html
      // 1) At top of closure, put: var __ = Relator.$();
      // 2) In constructor, put: var _ = __.constructor(this);
      // 3) At top of each prototype method, put: var _ = __.method(this);
      // 4) Use like:  _.privateVar = 5;
      function _indexOf(value) {
        var i = 0,
          length = this.length;
        while (i < length) {
          if (this[i] === value) {
            return i;
          }
          i++;
        }
        return -1;
      }

      function Relator() {
        var Stack = [],
          Array = [];
        if (!Stack.indexOf) {
          Stack.indexOf = _indexOf;
        }
        return {
          // create a new relator
          $           : function() {
            return Relator();
          },
          constructor : function(that) {
            var i = Stack.indexOf(that);
            ~
            i ? Array[i] : Array[Stack.push(that) - 1] = {};
            this.method(that)
              .that = that;
            return this.method(that);
          },
          method      : function(that) {
            return Array[Stack.indexOf(that)];
          }
        };
      }
      return Relator();
    }());
  }
  // END REDUNDANT

  if (p && p.ini && p.ini['phpjs.return_phpjs_arrays'].local_value.toLowerCase() === 'on') {
    if (!p.PHPJS_Array) {
      // We keep this Relator outside the class in case adding prototype methods below
      // Prototype methods added elsewhere can also use this ArrayRelator to share these "pseudo-global mostly-private" variables
      __ = p.ArrayRelator = p.ArrayRelator || p.Relator.$();
      // We could instead allow arguments of {key:XX, value:YY} but even more cumbersome to write
      p.PHPJS_Array = function PHPJS_Array() {
        var _ = __.constructor(this),
          args = arguments,
          i = 0,
          argl, p;
        args = (args.length === 1 && args[0] && typeof args[0] === 'object' &&
          // If first and only arg is an array, use that (Don't depend on this)
          args[0].length && !args[0].propertyIsEnumerable('length')) ? args[0] : args;
        if (!_.objectChain) {
          _.objectChain = args;
          _.object = {};
          _.keys = [];
          _.values = [];
        }
        for (argl = args.length; i < argl; i++) {
          for (p in args[i]) {
            // Allow for access by key; use of private members to store sequence allows these to be iterated via for...in (but for read-only use, with hasOwnProperty or function filtering to avoid prototype methods, and per ES, potentially out of order)
            this[p] = _.object[p] = args[i][p];
            // Allow for easier access by prototype methods
            _.keys[_.keys.length] = p;
            _.values[_.values.length] = args[i][p];
            break;
          }
        }
      };
      e = p.PHPJS_Array.prototype;
      e.change_key_case = function(cs) {
        var _ = __.method(this),
          oldkey, newkey, i = 0,
          kl = _.keys.length,
          case_fn = (!cs || cs === 'CASE_LOWER') ? 'toLowerCase' : 'toUpperCase';
        while (i < kl) {
          oldkey = _.keys[i];
          newkey = _.keys[i] = _.keys[i][case_fn]();
          if (oldkey !== newkey) {
            // Break reference before deleting
            this[oldkey] = _.object[oldkey] = _.objectChain[i][oldkey] = null;
            delete this[oldkey];
            delete _.object[oldkey];
            delete _.objectChain[i][oldkey];
            // Fix: should we make a deep copy?
            this[newkey] = _.object[newkey] = _.objectChain[i][newkey] = _.values[i];
          }
          i++;
        }
        return this;
      };
      e.flip = function() {
        var _ = __.method(this),
          i = 0,
          kl = _.keys.length;
        while (i < kl) {
          oldkey = _.keys[i];
          newkey = _.values[i];
          if (oldkey !== newkey) {
            // Break reference before deleting
            this[oldkey] = _.object[oldkey] = _.objectChain[i][oldkey] = null;
            delete this[oldkey];
            delete _.object[oldkey];
            delete _.objectChain[i][oldkey];
            this[newkey] = _.object[newkey] = _.objectChain[i][newkey] = oldkey;
            _.keys[i] = newkey;
          }
          i++;
        }
        return this;
      };
      e.walk = function(funcname, userdata) {
        var _ = __.method(this),
          obj, func, ini, i = 0,
          kl = 0;

        try {
          if (typeof funcname === 'function') {
            for (i = 0, kl = _.keys.length; i < kl; i++) {
              if (arguments.length > 1) {
                funcname(_.values[i], _.keys[i], userdata);
              } else {
                funcname(_.values[i], _.keys[i]);
              }
            }
          } else if (typeof funcname === 'string') {
            this.php_js = this.php_js || {};
            this.php_js.ini = this.php_js.ini || {};
            ini = this.php_js.ini['phpjs.no-eval'];
            if (ini && (
                parseInt(ini.local_value, 10) !== 0 && (!ini.local_value.toLowerCase || ini.local_value
                  .toLowerCase() !== 'off')
              )) {
              if (arguments.length > 1) {
                for (i = 0, kl = _.keys.length; i < kl; i++) {
                  this.window[funcname](_.values[i], _.keys[i], userdata);
                }
              } else {
                for (i = 0, kl = _.keys.length; i < kl; i++) {
                  this.window[funcname](_.values[i], _.keys[i]);
                }
              }
            } else {
              if (arguments.length > 1) {
                for (i = 0, kl = _.keys.length; i < kl; i++) {
                  eval(funcname + '(_.values[i], _.keys[i], userdata)');
                }
              } else {
                for (i = 0, kl = _.keys.length; i < kl; i++) {
                  eval(funcname + '(_.values[i], _.keys[i])');
                }
              }
            }
          } else if (funcname && typeof funcname === 'object' && funcname.length === 2) {
            obj = funcname[0];
            func = funcname[1];
            if (arguments.length > 1) {
              for (i = 0, kl = _.keys.length; i < kl; i++) {
                obj[func](_.values[i], _.keys[i], userdata);
              }
            } else {
              for (i = 0, kl = _.keys.length; i < kl; i++) {
                obj[func](_.values[i], _.keys[i]);
              }
            }
          } else {
            return false;
          }
        } catch (e) {
          return false;
        }

        return this;
      };
      // Here we'll return actual arrays since most logical and practical for these functions to do this
      e.keys = function(search_value, argStrict) {
        var _ = __.method(this),
          pos,
          search = typeof search_value !== 'undefined',
          tmp_arr = [],
          strict = !!argStrict;
        if (!search) {
          return _.keys;
        }
        while ((pos = _indexOf(_.values, pos, strict)) !== -1) {
          tmp_arr[tmp_arr.length] = _.keys[pos];
        }
        return tmp_arr;
      };
      e.values = function() {
        var _ = __.method(this);
        return _.values;
      };
      // Return non-object, non-array values, since most sensible
      e.search = function(needle, argStrict) {
        var _ = __.method(this),
          strict = !!argStrict,
          haystack = _.values,
          i, vl, val, flags;
        if (typeof needle === 'object' && needle.exec) {
          // Duck-type for RegExp
          if (!strict) {
            // Let's consider case sensitive searches as strict
            flags = 'i' + (needle.global ? 'g' : '') +
              (needle.multiline ? 'm' : '') +
              // sticky is FF only
              (needle.sticky ? 'y' : '');
            needle = new RegExp(needle.source, flags);
          }
          for (i = 0, vl = haystack.length; i < vl; i++) {
            val = haystack[i];
            if (needle.test(val)) {
              return _.keys[i];
            }
          }
          return false;
        }
        for (i = 0, vl = haystack.length; i < vl; i++) {
          val = haystack[i];
          if ((strict && val === needle) || (!strict && val == needle)) {
            return _.keys[i];
          }
        }
        return false;
      };
      e.sum = function() {
        var _ = __.method(this),
          sum = 0,
          i = 0,
          kl = _.keys.length;
        while (i < kl) {
          if (!isNaN(parseFloat(_.values[i]))) {
            sum += parseFloat(_.values[i]);
          }
          i++;
        }
        return sum;
      };
      // Experimental functions
      e.foreach = function(handler) {
        var _ = __.method(this),
          i = 0,
          kl = _.keys.length;
        while (i < kl) {
          if (handler.length === 1) {
            // only pass the value
            handler(_.values[i]);
          } else {
            handler(_.keys[i], _.values[i]);
          }
          i++;
        }
        return this;
      };
      e.list = function() {
        var key, _ = __.method(this),
          i = 0,
          argl = arguments.length;
        while (i < argl) {
          key = _.keys[i];
          if (key && key.length === parseInt(key, 10)
            .toString()
            .length && // Key represents an int
            parseInt(key, 10) < argl) {
            // Key does not exceed arguments
            that.window[arguments[key]] = _.values[key];
          }
          i++;
        }
        return this;
      };
      // Parallel functionality and naming of built-in JavaScript array methods
      e.forEach = function(handler) {
        var _ = __.method(this),
          i = 0,
          kl = _.keys.length;
        while (i < kl) {
          handler(_.values[i], _.keys[i], this);
          i++;
        }
        return this;
      };
      // Our own custom convenience functions
      e.$object = function() {
        var _ = __.method(this);
        return _.object;
      };
      e.$objectChain = function() {
        var _ = __.method(this);
        return _.objectChain;
      };
    }
    PHPJS_Array.prototype = p.PHPJS_Array.prototype;
    arrInst = new PHPJS_Array();
    p.PHPJS_Array.apply(arrInst, mainArgs);
    return arrInst;
  }
  return Array.prototype.slice.call(mainArgs);
}

function array_splice(arr, offst, lgth, replacement) {
  //  discuss at: http://phpjs.org/functions/array_splice/
  // original by: Brett Zamir (http://brett-zamir.me)
  //    input by: Theriault
  //        note: Order does get shifted in associative array input with numeric indices,
  //        note: since PHP behavior doesn't preserve keys, but I understand order is
  //        note: not reliable anyways
  //        note: Note also that IE retains information about property position even
  //        note: after being supposedly deleted, so use of this function may produce
  //        note: unexpected results in IE if you later attempt to add back properties
  //        note: with the same keys that had been deleted
  //  depends on: is_int
  //   example 1: input = {4: "red", 'abc': "green", 2: "blue", 'dud': "yellow"};
  //   example 1: array_splice(input, 2);
  //   returns 1: {0: "blue", 'dud': "yellow"}
  //   example 2: input = ["red", "green", "blue", "yellow"];
  //   example 2: array_splice(input, 3, 0, "purple");
  //   returns 2: []
  //   example 3: input = ["red", "green", "blue", "yellow"]
  //   example 3: array_splice(input, -1, 1, ["black", "maroon"]);
  //   returns 3: ["yellow"]

  var _checkToUpIndices = function(arr, ct, key) {
    // Deal with situation, e.g., if encounter index 4 and try to set it to 0, but 0 exists later in loop (need to
    // increment all subsequent (skipping current key, since we need its value below) until find unused)
    if (arr[ct] !== undefined) {
      var tmp = ct;
      ct += 1;
      if (ct === key) {
        ct += 1;
      }
      ct = _checkToUpIndices(arr, ct, key);
      arr[ct] = arr[tmp];
      delete arr[tmp];
    }
    return ct;
  };

  if (replacement && typeof replacement !== 'object') {
    replacement = [replacement];
  }
  if (lgth === undefined) {
    lgth = offst >= 0 ? arr.length - offst : -offst;
  } else if (lgth < 0) {
    lgth = (offst >= 0 ? arr.length - offst : -offst) + lgth;
  }

  if (Object.prototype.toString.call(arr) !== '[object Array]') {
    /*if (arr.length !== undefined) {
     // Deal with array-like objects as input
    delete arr.length;
    }*/
    var lgt = 0,
      ct = -1,
      rmvd = [],
      rmvdObj = {},
      repl_ct = -1,
      int_ct = -1;
    var returnArr = true,
      rmvd_ct = 0,
      rmvd_lgth = 0,
      key = '';
    // rmvdObj.length = 0;
    for (key in arr) {
      // Can do arr.__count__ in some browsers
      lgt += 1;
    }
    offst = (offst >= 0) ? offst : lgt + offst;
    for (key in arr) {
      ct += 1;
      if (ct < offst) {
        if (this.is_int(key)) {
          int_ct += 1;
          if (parseInt(key, 10) === int_ct) {
            // Key is already numbered ok, so don't need to change key for value
            continue;
          }
          // Deal with situation, e.g.,
          _checkToUpIndices(arr, int_ct, key);
          // if encounter index 4 and try to set it to 0, but 0 exists later in loop
          arr[int_ct] = arr[key];
          delete arr[key];
        }
        continue;
      }
      if (returnArr && this.is_int(key)) {
        rmvd.push(arr[key]);
        // PHP starts over here too
        rmvdObj[rmvd_ct++] = arr[key];
      } else {
        rmvdObj[key] = arr[key];
        returnArr = false;
      }
      rmvd_lgth += 1;
      // rmvdObj.length += 1;
      if (replacement && replacement[++repl_ct]) {
        arr[key] = replacement[repl_ct];
      } else {
        delete arr[key];
      }
    }
    // Make (back) into an array-like object
    // arr.length = lgt - rmvd_lgth + (replacement ? replacement.length : 0);
    return returnArr ? rmvd : rmvdObj;
  }

  if (replacement) {
    replacement.unshift(offst, lgth);
    return Array.prototype.splice.apply(arr, replacement);
  }
  return arr.splice(offst, lgth);
}

function usort(inputArr, sorter) {
  //  discuss at: http://phpjs.org/functions/usort/
  // original by: Brett Zamir (http://brett-zamir.me)
  // improved by: Brett Zamir (http://brett-zamir.me)
  //        note: This function deviates from PHP in returning a copy of the array instead
  //        note: of acting by reference and returning true; this was necessary because
  //        note: IE does not allow deleting and re-adding of properties without caching
  //        note: of property position; you can set the ini of "phpjs.strictForIn" to true to
  //        note: get the PHP behavior, but use this only if you are in an environment
  //        note: such as Firefox extensions where for-in iteration order is fixed and true
  //        note: property deletion is supported. Note that we intend to implement the PHP
  //        note: behavior by default if IE ever does allow it; only gives shallow copy since
  //        note: is by reference in PHP anyways
  //   example 1: stuff = {d: '3', a: '1', b: '11', c: '4'};
  //   example 1: stuff = usort(stuff, function (a, b) {return(a-b);});
  //   example 1: $result = stuff;
  //   returns 1: {0: '1', 1: '3', 2: '4', 3: '11'};

  var valArr = [],
    k = '',
    i = 0,
    strictForIn = false,
    populateArr = {};

  if (typeof sorter === 'string') {
    sorter = this[sorter];
  } else if (Object.prototype.toString.call(sorter) === '[object Array]') {
    sorter = this[sorter[0]][sorter[1]];
  }

  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};
  this.php_js.ini = this.php_js.ini || {};
  // END REDUNDANT
  strictForIn = this.php_js.ini['phpjs.strictForIn'] && this.php_js.ini['phpjs.strictForIn'].local_value && this.php_js
    .ini['phpjs.strictForIn'].local_value !== 'off';
  populateArr = strictForIn ? inputArr : populateArr;

  for (k in inputArr) {
    // Get key and value arrays
    if (inputArr.hasOwnProperty(k)) {
      valArr.push(inputArr[k]);
      if (strictForIn) {
        delete inputArr[k];
      }
    }
  }
  try {
    valArr.sort(sorter);
  } catch (e) {
    return false;
  }
  for (i = 0; i < valArr.length; i++) {
    // Repopulate the old array
    populateArr[i] = valArr[i];
  }

  return strictForIn || populateArr;
}

function chr(codePt) {
  //  discuss at: http://phpjs.org/functions/chr/
  // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Brett Zamir (http://brett-zamir.me)
  //   example 1: chr(75) === 'K';
  //   example 1: chr(65536) === '\uD800\uDC00';
  //   returns 1: true
  //   returns 1: true

  if (codePt > 0xFFFF) { // Create a four-byte string (length 2) since this code point is high
    //   enough for the UTF-16 encoding (JavaScript internal use), to
    //   require representation with two surrogates (reserved non-characters
    //   used for building other characters; the first is "high" and the next "low")
    codePt -= 0x10000;
    return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF));
  }
  return String.fromCharCode(codePt);
}

function array_sum(array) {
  //  discuss at: http://phpjs.org/functions/array_sum/
  // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // bugfixed by: Nate
  // bugfixed by: Gilbert
  // improved by: David Pilia (http://www.beteck.it/)
  // improved by: Brett Zamir (http://brett-zamir.me)
  //   example 1: array_sum([4, 9, 182.6]);
  //   returns 1: 195.6
  //   example 2: total = []; index = 0.1; for (y=0; y < 12; y++){total[y] = y + index;}
  //   example 2: array_sum(total);
  //   returns 2: 67.2

  var key, sum = 0;

  if (array && typeof array === 'object' && array.change_key_case) {
    // Duck-type check for our own array()-created PHPJS_Array
    return array.sum.apply(array, Array.prototype.slice.call(arguments, 0));
  }

  // input sanitation
  if (typeof array !== 'object') {
    return null;
  }

  for (key in array) {
    if (!isNaN(parseFloat(array[key]))) {
      sum += parseFloat(array[key]);
    }
  }

  return sum;
}

function explode(delimiter, source, limit) {
  //  discuss at: http://phpjs.org/functions/explode/
  // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //   example 1: explode(' ', 'Kevin van Zonneveld');
  //   returns 1: {0: 'Kevin', 1: 'van', 2: 'Zonneveld'}

  if (arguments.length < 2 || typeof delimiter === 'undefined' || typeof source === 'undefined') return null;
  if (delimiter === '' || delimiter === false || delimiter === null) return false;
  if (typeof delimiter === 'function' || typeof delimiter === 'object' || typeof source === 'function' || typeof source ===
    'object') {
    return {
      0 : ''
    };
  }
  if (delimiter === true) delimiter = '1';

  // Here we go...
  delimiter += '';
  source += '';

  var s = source.split(delimiter);

  if (typeof limit === 'undefined') return s;

  // Support for limit
  if (limit === 0) limit = 1;

  // Positive limit
  if (limit > 0) {
    if (limit >= s.length) return s;
    return s.slice(0, limit - 1)
      .concat([s.slice(limit - 1)
        .join(delimiter)
      ]);
  }

  // Negative limit
  if (-limit >= s.length) return [];

  s.splice(s.length + limit);
  return s;
}

function abs(mixed_number) {
  //  discuss at: http://phpjs.org/functions/abs/
  // original by: Waldo Malqui Silva (http://waldo.malqui.info)
  // improved by: Karol Kowalski
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  //   example 1: abs(4.2);
  //   returns 1: 4.2
  //   example 2: abs(-4.2);
  //   returns 2: 4.2
  //   example 3: abs(-5);
  //   returns 3: 5
  //   example 4: abs('_argos');
  //   returns 4: 0

  return Math.abs(mixed_number) || 0;
}

function rtrim(str, charlist) {
  //  discuss at: http://phpjs.org/functions/rtrim/
  // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //    input by: Erkekjetter
  //    input by: rem
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // bugfixed by: Onno Marsman
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //   example 1: rtrim('    Kevin van Zonneveld    ');
  //   returns 1: '    Kevin van Zonneveld'

  charlist = !charlist ? ' \\s\u00A0' : (charlist + '')
    .replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\\$1');
  var re = new RegExp('[' + charlist + ']+$', 'g');
  return (str + '')
    .replace(re, '');
}

function array_values(input) {
  //  discuss at: http://phpjs.org/functions/array_values/
  // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Brett Zamir (http://brett-zamir.me)
  //   example 1: array_values( {firstname: 'Kevin', surname: 'van Zonneveld'} );
  //   returns 1: {0: 'Kevin', 1: 'van Zonneveld'}

  var tmp_arr = [],
    key = '';

  if (input && typeof input === 'object' && input.change_key_case) {
    // Duck-type check for our own array()-created PHPJS_Array
    return input.values();
  }

  for (key in input) {
    tmp_arr[tmp_arr.length] = input[key];
  }

  return tmp_arr;
}
function is_numeric( obj ) {
    return !jQuery.isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
}

function floatval ( obj)
{
    return parseFloat( obj );
}

function round( x, y)
{
    return $round(x,y);
}

//parameter limit is optional (default value is -1)
//paramater pattern is a string type
 
//ex: preg_replace("/Hello/i","Hi",strtoreplace)
function preg_replace(pattern,replacement,subject,limit)
{
    if(typeof limit == "undefined") limit=-1;
    if(subject.match(eval(pattern))) {
    if(limit == -1)                { //no limit
            return subject.replace(eval(pattern + "g"), replacement);
    }                
    else
    {
        for(x=0;x<limit;x++)
        {  
            subject=subject.replace(eval(pattern),replacement);
        }
        return subject;
     }
    }else{
        return subject;
    }
}

function str_pad(input, pad_length, pad_string, pad_type) {
  //  discuss at: http://phpjs.org/functions/str_pad/
  // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Michael White (http://getsprink.com)
  //    input by: Marco van Oort
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //   example 1: str_pad('Kevin van Zonneveld', 30, '-=', 'STR_PAD_LEFT');
  //   returns 1: '-=-=-=-=-=-Kevin van Zonneveld'
  //   example 2: str_pad('Kevin van Zonneveld', 30, '-', 'STR_PAD_BOTH');
  //   returns 2: '------Kevin van Zonneveld-----'

  var half = '',
    pad_to_go;

  var str_pad_repeater = function(s, len) {
    var collect = '',
      i;

    while (collect.length < len) {
      collect += s;
    }
    collect = collect.substr(0, len);

    return collect;
  };

  input += '';
  pad_string = pad_string !== undefined ? pad_string : ' ';

  if (pad_type !== 'STR_PAD_LEFT' && pad_type !== 'STR_PAD_RIGHT' && pad_type !== 'STR_PAD_BOTH') {
    pad_type = 'STR_PAD_RIGHT';
  }
  if ((pad_to_go = pad_length - input.length) > 0) {
    if (pad_type === 'STR_PAD_LEFT') {
      input = str_pad_repeater(pad_string, pad_to_go) + input;
    } else if (pad_type === 'STR_PAD_RIGHT') {
      input = input + str_pad_repeater(pad_string, pad_to_go);
    } else if (pad_type === 'STR_PAD_BOTH') {
      half = str_pad_repeater(pad_string, Math.ceil(pad_to_go / 2));
      input = half + input + half;
      input = input.substr(0, pad_length);
    }
  }

  return input;
}