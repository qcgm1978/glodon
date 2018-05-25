// 如果独立web2d,这个通用库需要提出来
var CLOUD = CLOUD || {};
CLOUD.Version2D = "20161009";
CLOUD.DomUtil = CLOUD.DomUtil || {
    /**
     * split string on whitespace
     * @param {String} str
     * @returns {Array} words
     */
    splitStr: function (str) {
        return str.trim().split(/\s+/g);
    },
    /**
     * get the container offset relative to client
     * @param {object} domElement
     * @returns {object}
     */
    getContainerOffsetToClient: function (domElement) {
        var offsetObj;
        // 获取相对于视口(客户区域)的偏移量
        var getOffsetSum = function (ele) {
            var top = 0, left = 0;
            // 遍历父元素,获取相对与document的偏移量
            while (ele) {
                top += ele.offsetTop;
                left += ele.offsetLeft;
                ele = ele.offsetParent;
            }
            // 只处理document的滚动条(一般也用不着内部滚动条)
            var body = document.body,
                docElem = document.documentElement;
            //获取页面的scrollTop,scrollLeft(兼容性写法)
            var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop,
                scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
            // 减掉滚动距离，获得相对于客户区域的偏移量
            top -= scrollTop;
            left -= scrollLeft;
            return {
                top: top,
                left: left
            }
        };
        // 获取相对于视口(客户区域)的偏移量(viewpoint), 不加页面的滚动量(scroll)
        var getOffsetRect = function (ele) {
            // getBoundingClientRect返回一个矩形对象，包含四个属性：left、top、right和bottom。分别表示元素各边与页面上边和左边的距离。
            //注意：IE、Firefox3+、Opera9.5、Chrome、Safari支持，在IE中，默认坐标从(2,2)开始计算，导致最终距离比其他浏览器多出两个像素，我们需要做个兼容。
            var box = ele.getBoundingClientRect();
            var body = document.body, docElem = document.documentElement;
            //获取页面的scrollTop,scrollLeft(兼容性写法)
            //var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop,
            //    scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
            var clientTop = docElem.clientTop || body.clientTop,
                clientLeft = docElem.clientLeft || body.clientLeft;
            var top = box.top - clientTop,
                left = box.left - clientLeft;
            return {
                //Math.round 兼容火狐浏览器bug
                top: Math.round(top),
                left: Math.round(left)
            }
        };
        //获取元素相对于页面的偏移
        var getOffset = function (ele) {
            if (ele.getBoundingClientRect) {
                return getOffsetRect(ele);
            } else {
                return getOffsetSum(ele);
            }
        };
        if (domElement != document) {
            
            // 这种方式的目的是为了让外部直接传入clientX,clientY,然后计算出相对父容器的offsetX,offsetY值,
            // 即 offsetX = clientX - offsetV.left, offsetY = clientY - offsetV.top
            var offsetV = getOffset(domElement);
            // domElement.offsetLeft（offsetTop）是相对父容器的偏移量，如果用相对坐标表示，直接传回0
            //offset	: [ domElement.offsetLeft,  domElement.offsetTop ]
            offsetObj = {
                width: domElement.offsetWidth,
                height: domElement.offsetHeight,
                left: offsetV.left,
                top: offsetV.top
            }
        } else {
            offsetObj = {
                width: window.innerWidth,
                height: window.innerHeight,
                left: 0,
                top: 0
            }
        }
        return offsetObj;
    },
    /**
     * set css class name
     * @param {String} id
     * @param {String} cssName
     */
    setClassName: function (id, cssName) {
        var dom = document.getElementById(id);
        if (dom) {
            dom.className = cssName;
        }
    },
    /**
     * add css class name
     * @param {String} id
     * @param {String} cssName
     */
    addClassName: function (id, cssName) {
        var a, b, c;
        var i, j;
        var s = /\s+/;
        var dom = document.getElementById(id);
        if (dom) {
            b = dom;
            if (cssName && typeof cssName == "string") {
                a = cssName.split(s);
                // 如果节点是元素节点，则 nodeType 属性将返回 1。
                // 如果节点是属性节点，则 nodeType 属性将返回 2。
                if (b.nodeType === 1) {
                    if (!b.className && a.length === 1) {
                        b.className = cssName;
                    } else {
                        c = " " + b.className + " ";
                        for (i = 0, j = a.length; i < j; ++i) {
                            c.indexOf(" " + a[i] + " ") < 0 && (c += a[0] + " ");
                        }
                        b.className = String.trim(c);
                    }
                }
            }
        }
    },
    /**
     * remove css class name
     * @param {String} id
     * @param {String} cssName
     */
    removeClassName: function (id, className) {
        var a, b, c;
        var i, j;
        var s = /\s+/;
        var dom = document.getElementById(id);
        if (dom) {
            c = dom;
            if (className && typeof className == "string") {
                a = (className || "").split(s);
                if (c.nodeType === 1 && c.className) {
                    b = (" " + c.className + " ").replace(O, " ");
                    for (i = 0, j = a.length; i < j; i++) {
                        while (b.indexOf(" " + a[i] + " ") >= 0) {
                            b = b.replace(" " + a[i] + " ", " ");
                        }
                    }
                    c.className = className ? String.trim(b) : ""
                }
            }
        }
    },
    /**
     * show or hide element
     * @param {String} id
     * @param {Boolean} isShow
     */
    showOrHideElement: function (id, isShow) {
        var dom = document.getElementById(id);
        if (dom) {
            if (isShow) {
                dom.style.display = "";
            } else {
                dom.style.display = "none";
            }
        }
    },
    getStyleString: function
        (style) {
        var elements = [];
        for (var key in style) {
            var val = style[key];
            elements.push(key);
            elements.push(':');
            elements.push(val);
            elements.push('; ');
        }
        return elements.join('');
    },
    cloneStyle: function (style) {
        var clone = {};
        for (var key in style) {
            clone[key] = style[key];
        }
        return clone;
    },
    removeStyleAttribute: function (style, attrs) {
        if (!Array.isArray(attrs)) {
            attrs = [attrs];
        }
        attrs.forEach(function (key) {
            if (key in style) {
                delete style[key];
            }
        });
    },
    trimRight: function (text) {
        if (text.length === 0) {
            return "";
        }
        var lastNonSpace = text.length - 1;
        for (var i = lastNonSpace; i >= 0; --i) {
            if (text.charAt(i) !== ' ') {
                lastNonSpace = i;
                break;
            }
        }
        return text.substr(0, lastNonSpace + 1);
    },
    trimLeft: function (text) {
        if (text.length === 0) {
            return "";
        }
        var firstNonSpace = 0;
        for (var i = 0; i < text.length; ++i) {
            if (text.charAt(i) !== ' ') {
                firstNonSpace = i;
                break;
            }
        }
        return text.substr(firstNonSpace);
    },
    matchesSelector: function (domElem, selector) {
        if (domElem.matches) {
            return domElem.matches(selector);
        }
        if (domElem.matchesSelector) {
            return domElem.matchesSelector(selector);
        }
        if (domElem.webkitMatchesSelector) {
            return domElem.webkitMatchesSelector(selector);
        }
        if (domElem.msMatchesSelector) {
            return domElem.msMatchesSelector(selector);
        }
        if (domElem.mozMatchesSelector) {
            return domElem.mozMatchesSelector(selector);
        }
        if (domElem.oMatchesSelector) {
            return domElem.oMatchesSelector(selector);
        }
        if (domElem.querySelectorAll) {
            var matches = (domElem.document || domElem.ownerDocument).querySelectorAll(selector),
                i = 0;
            while (matches[i] && matches[i] !== element) i++;
            return matches[i] ? true : false;
        }
        return false;
    },
    toTranslate3d: function (x, y) {
        return 'translate3d(' + x + 'px,' + y + 'px,0)';
    },
    setCursorStyle: function (element, direction) {
        var cursor;
        switch (direction) {
            case 'n':
            case 's':
                cursor = 'ns-resize';
                break;
            case 'w':
            case 'e':
                cursor = 'ew-resize';
                break;
            case 'ne':
            case 'sw':
                cursor = 'nesw-resize';
                break;
            case 'nw':
            case 'se':
                cursor = 'nwse-resize';
                break;
        }
        element.style.cursor = cursor;
    }
};
/*
  html2canvas 0.5.0-beta3 <http://html2canvas.hertzen.com>
  Copyright (c) 2016 Niklas von Hertzen

  Released under  License
*/
!function (e) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = e(); else if ("function" == typeof define && define.amd) define([], e); else {
        var f;
        "undefined" != typeof window ? f = window : "undefined" != typeof global ? f = global : "undefined" != typeof self && (f = self), f.html2canvas = e()
    }
}(function () {
    var define, module, exports;
    return (function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;
                    if (!u && a) return a(o, !0);
                    if (i) return i(o, !0);
                    var f = new Error("Cannot find module '" + o + "'");
                    throw f.code = "MODULE_NOT_FOUND", f
                }
                var l = n[o] = {exports: {}};
                t[o][0].call(l.exports, function (e) {
                    var n = t[o][1][e];
                    return s(n ? n : e)
                }, l, l.exports, e, t, n, r)
            }
            return n[o].exports
        }
        
        var i = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++) s(r[o]);
        return s
    })({
        1: [function (_dereq_, module, exports) {
            (function (global) {
                /*! http://mths.be/punycode v1.2.4 by @mathias */
                ;(function (root) {
                    /** Detect free variables */
                    var freeExports = typeof exports == 'object' && exports;
                    var freeModule = typeof module == 'object' && module &&
                        module.exports == freeExports && module;
                    var freeGlobal = typeof global == 'object' && global;
                    if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
                        root = freeGlobal;
                    }
                    /**
                     * The `punycode` object.
                     * @name punycode
                     * @type Object
                     */
                    var punycode,
                        /** Highest positive signed 32-bit float value */
                        maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1
                        /** Bootstring parameters */
                        base = 36,
                        tMin = 1,
                        tMax = 26,
                        skew = 38,
                        damp = 700,
                        initialBias = 72,
                        initialN = 128, // 0x80
                        delimiter = '-', // '\x2D'
                        /** Regular expressions */
                        regexPunycode = /^xn--/,
                        regexNonASCII = /[^ -~]/, // unprintable ASCII chars + non-ASCII chars
                        regexSeparators = /\x2E|\u3002|\uFF0E|\uFF61/g, // RFC 3490 separators
                        /** Error messages */
                        errors = {
                            'overflow': 'Overflow: input needs wider integers to process',
                            'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
                            'invalid-input': 'Invalid input'
                        },
                        /** Convenience shortcuts */
                        baseMinusTMin = base - tMin,
                        floor = Math.floor,
                        stringFromCharCode = String.fromCharCode,
                        /** Temporary variable */
                        key;
                    
                    /*--------------------------------------------------------------------------*/
                    /**
                     * A generic error utility function.
                     * @private
                     * @param {String} type The error type.
                     * @returns {Error} Throws a `RangeError` with the applicable error message.
                     */
                    function error(type) {
                        throw RangeError(errors[type]);
                    }
                    
                    /**
                     * A generic `Array#map` utility function.
                     * @private
                     * @param {Array} array The array to iterate over.
                     * @param {Function} callback The function that gets called for every array
                     * item.
                     * @returns {Array} A new array of values returned by the callback function.
                     */
                    function map(array, fn) {
                        var length = array.length;
                        while (length--) {
                            array[length] = fn(array[length]);
                        }
                        return array;
                    }
                    
                    /**
                     * A simple `Array#map`-like wrapper to work with domain name strings.
                     * @private
                     * @param {String} domain The domain name.
                     * @param {Function} callback The function that gets called for every
                     * character.
                     * @returns {Array} A new string of characters returned by the callback
                     * function.
                     */
                    function mapDomain(string, fn) {
                        return map(string.split(regexSeparators), fn).join('.');
                    }
                    
                    /**
                     * Creates an array containing the numeric code points of each Unicode
                     * character in the string. While JavaScript uses UCS-2 internally,
                     * this function will convert a pair of surrogate halves (each of which
                     * UCS-2 exposes as separate characters) into a single code point,
                     * matching UTF-16.
                     * @see `punycode.ucs2.encode`
                     * @see <http://mathiasbynens.be/notes/javascript-encoding>
                     * @memberOf punycode.ucs2
                     * @name decode
                     * @param {String} string The Unicode input string (UCS-2).
                     * @returns {Array} The new array of code points.
                     */
                    function ucs2decode(string) {
                        var output = [],
                            counter = 0,
                            length = string.length,
                            value,
                            extra;
                        while (counter < length) {
                            value = string.charCodeAt(counter++);
                            if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
                                // high surrogate, and there is a next character
                                extra = string.charCodeAt(counter++);
                                if ((extra & 0xFC00) == 0xDC00) { // low surrogate
                                    output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
                                } else {
                                    // unmatched surrogate; only append this code unit, in case the next
                                    // code unit is the high surrogate of a surrogate pair
                                    output.push(value);
                                    counter--;
                                }
                            } else {
                                output.push(value);
                            }
                        }
                        return output;
                    }
                    
                    /**
                     * Creates a string based on an array of numeric code points.
                     * @see `punycode.ucs2.decode`
                     * @memberOf punycode.ucs2
                     * @name encode
                     * @param {Array} codePoints The array of numeric code points.
                     * @returns {String} The new Unicode string (UCS-2).
                     */
                    function ucs2encode(array) {
                        return map(array, function (value) {
                            var output = '';
                            if (value > 0xFFFF) {
                                value -= 0x10000;
                                output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
                                value = 0xDC00 | value & 0x3FF;
                            }
                            output += stringFromCharCode(value);
                            return output;
                        }).join('');
                    }
                    
                    /**
                     * Converts a basic code point into a digit/integer.
                     * @see `digitToBasic()`
                     * @private
                     * @param {Number} codePoint The basic numeric code point value.
                     * @returns {Number} The numeric value of a basic code point (for use in
                     * representing integers) in the range `0` to `base - 1`, or `base` if
                     * the code point does not represent a value.
                     */
                    function basicToDigit(codePoint) {
                        if (codePoint - 48 < 10) {
                            return codePoint - 22;
                        }
                        if (codePoint - 65 < 26) {
                            return codePoint - 65;
                        }
                        if (codePoint - 97 < 26) {
                            return codePoint - 97;
                        }
                        return base;
                    }
                    
                    /**
                     * Converts a digit/integer into a basic code point.
                     * @see `basicToDigit()`
                     * @private
                     * @param {Number} digit The numeric value of a basic code point.
                     * @returns {Number} The basic code point whose value (when used for
                     * representing integers) is `digit`, which needs to be in the range
                     * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
                     * used; else, the lowercase form is used. The behavior is undefined
                     * if `flag` is non-zero and `digit` has no uppercase form.
                     */
                    function digitToBasic(digit, flag) {
                        //  0..25 map to ASCII a..z or A..Z
                        // 26..35 map to ASCII 0..9
                        return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
                    }
                    
                    /**
                     * Bias adaptation function as per section 3.4 of RFC 3492.
                     * http://tools.ietf.org/html/rfc3492#section-3.4
                     * @private
                     */
                    function adapt(delta, numPoints, firstTime) {
                        var k = 0;
                        delta = firstTime ? floor(delta / damp) : delta >> 1;
                        delta += floor(delta / numPoints);
                        for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
                            delta = floor(delta / baseMinusTMin);
                        }
                        return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
                    }
                    
                    /**
                     * Converts a Punycode string of ASCII-only symbols to a string of Unicode
                     * symbols.
                     * @memberOf punycode
                     * @param {String} input The Punycode string of ASCII-only symbols.
                     * @returns {String} The resulting string of Unicode symbols.
                     */
                    function decode(input) {
                        // Don't use UCS-2
                        var output = [],
                            inputLength = input.length,
                            out,
                            i = 0,
                            n = initialN,
                            bias = initialBias,
                            basic,
                            j,
                            index,
                            oldi,
                            w,
                            k,
                            digit,
                            t,
                            /** Cached calculation results */
                            baseMinusT;
                        // Handle the basic code points: let `basic` be the number of input code
                        // points before the last delimiter, or `0` if there is none, then copy
                        // the first basic code points to the output.
                        basic = input.lastIndexOf(delimiter);
                        if (basic < 0) {
                            basic = 0;
                        }
                        for (j = 0; j < basic; ++j) {
                            // if it's not a basic code point
                            if (input.charCodeAt(j) >= 0x80) {
                                error('not-basic');
                            }
                            output.push(input.charCodeAt(j));
                        }
                        // Main decoding loop: start just after the last delimiter if any basic code
                        // points were copied; start at the beginning otherwise.
                        for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {
                            
                            // `index` is the index of the next character to be consumed.
                            // Decode a generalized variable-length integer into `delta`,
                            // which gets added to `i`. The overflow checking is easier
                            // if we increase `i` as we go, then subtract off its starting
                            // value at the end to obtain `delta`.
                            for (oldi = i, w = 1, k = base; /* no condition */; k += base) {
                                if (index >= inputLength) {
                                    error('invalid-input');
                                }
                                digit = basicToDigit(input.charCodeAt(index++));
                                if (digit >= base || digit > floor((maxInt - i) / w)) {
                                    error('overflow');
                                }
                                i += digit * w;
                                t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
                                if (digit < t) {
                                    break;
                                }
                                baseMinusT = base - t;
                                if (w > floor(maxInt / baseMinusT)) {
                                    error('overflow');
                                }
                                w *= baseMinusT;
                            }
                            out = output.length + 1;
                            bias = adapt(i - oldi, out, oldi == 0);
                            // `i` was supposed to wrap around from `out` to `0`,
                            // incrementing `n` each time, so we'll fix that now:
                            if (floor(i / out) > maxInt - n) {
                                error('overflow');
                            }
                            n += floor(i / out);
                            i %= out;
                            // Insert `n` at position `i` of the output
                            output.splice(i++, 0, n);
                        }
                        return ucs2encode(output);
                    }
                    
                    /**
                     * Converts a string of Unicode symbols to a Punycode string of ASCII-only
                     * symbols.
                     * @memberOf punycode
                     * @param {String} input The string of Unicode symbols.
                     * @returns {String} The resulting Punycode string of ASCII-only symbols.
                     */
                    function encode(input) {
                        var n,
                            delta,
                            handledCPCount,
                            basicLength,
                            bias,
                            j,
                            m,
                            q,
                            k,
                            t,
                            currentValue,
                            output = [],
                            /** `inputLength` will hold the number of code points in `input`. */
                            inputLength,
                            /** Cached calculation results */
                            handledCPCountPlusOne,
                            baseMinusT,
                            qMinusT;
                        // Convert the input in UCS-2 to Unicode
                        input = ucs2decode(input);
                        // Cache the length
                        inputLength = input.length;
                        // Initialize the state
                        n = initialN;
                        delta = 0;
                        bias = initialBias;
                        // Handle the basic code points
                        for (j = 0; j < inputLength; ++j) {
                            currentValue = input[j];
                            if (currentValue < 0x80) {
                                output.push(stringFromCharCode(currentValue));
                            }
                        }
                        handledCPCount = basicLength = output.length;
                        // `handledCPCount` is the number of code points that have been handled;
                        // `basicLength` is the number of basic code points.
                        // Finish the basic string - if it is not empty - with a delimiter
                        if (basicLength) {
                            output.push(delimiter);
                        }
                        // Main encoding loop:
                        while (handledCPCount < inputLength) {
                            
                            // All non-basic code points < n have been handled already. Find the next
                            // larger one:
                            for (m = maxInt, j = 0; j < inputLength; ++j) {
                                currentValue = input[j];
                                if (currentValue >= n && currentValue < m) {
                                    m = currentValue;
                                }
                            }
                            // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
                            // but guard against overflow
                            handledCPCountPlusOne = handledCPCount + 1;
                            if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
                                error('overflow');
                            }
                            delta += (m - n) * handledCPCountPlusOne;
                            n = m;
                            for (j = 0; j < inputLength; ++j) {
                                currentValue = input[j];
                                if (currentValue < n && ++delta > maxInt) {
                                    error('overflow');
                                }
                                if (currentValue == n) {
                                    // Represent delta as a generalized variable-length integer
                                    for (q = delta, k = base; /* no condition */; k += base) {
                                        t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
                                        if (q < t) {
                                            break;
                                        }
                                        qMinusT = q - t;
                                        baseMinusT = base - t;
                                        output.push(
                                            stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
                                        );
                                        q = floor(qMinusT / baseMinusT);
                                    }
                                    output.push(stringFromCharCode(digitToBasic(q, 0)));
                                    bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
                                    delta = 0;
                                    ++handledCPCount;
                                }
                            }
                            ++delta;
                            ++n;
                        }
                        return output.join('');
                    }
                    
                    /**
                     * Converts a Punycode string representing a domain name to Unicode. Only the
                     * Punycoded parts of the domain name will be converted, i.e. it doesn't
                     * matter if you call it on a string that has already been converted to
                     * Unicode.
                     * @memberOf punycode
                     * @param {String} domain The Punycode domain name to convert to Unicode.
                     * @returns {String} The Unicode representation of the given Punycode
                     * string.
                     */
                    function toUnicode(domain) {
                        return mapDomain(domain, function (string) {
                            return regexPunycode.test(string)
                                ? decode(string.slice(4).toLowerCase())
                                : string;
                        });
                    }
                    
                    /**
                     * Converts a Unicode string representing a domain name to Punycode. Only the
                     * non-ASCII parts of the domain name will be converted, i.e. it doesn't
                     * matter if you call it with a domain that's already in ASCII.
                     * @memberOf punycode
                     * @param {String} domain The domain name to convert, as a Unicode string.
                     * @returns {String} The Punycode representation of the given domain name.
                     */
                    function toASCII(domain) {
                        return mapDomain(domain, function (string) {
                            return regexNonASCII.test(string)
                                ? 'xn--' + encode(string)
                                : string;
                        });
                    }
                    
                    /*--------------------------------------------------------------------------*/
                    /** Define the public API */
                    punycode = {
                        /**
                         * A string representing the current Punycode.js version number.
                         * @memberOf punycode
                         * @type String
                         */
                        'version': '1.2.4',
                        /**
                         * An object of methods to convert from JavaScript's internal character
                         * representation (UCS-2) to Unicode code points, and back.
                         * @see <http://mathiasbynens.be/notes/javascript-encoding>
                         * @memberOf punycode
                         * @type Object
                         */
                        'ucs2': {
                            'decode': ucs2decode,
                            'encode': ucs2encode
                        },
                        'decode': decode,
                        'encode': encode,
                        'toASCII': toASCII,
                        'toUnicode': toUnicode
                    };
                    /** Expose `punycode` */
                    // Some AMD build optimizers, like r.js, check for specific condition patterns
                    // like the following:
                    if (
                        typeof define == 'function' &&
                        typeof define.amd == 'object' &&
                        define.amd
                    ) {
                        define('punycode', function () {
                            return punycode;
                        });
                    } else if (freeExports && !freeExports.nodeType) {
                        if (freeModule) { // in Node.js or RingoJS v0.8.0+
                            freeModule.exports = punycode;
                        } else { // in Narwhal or RingoJS v0.7.0-
                            for (key in punycode) {
                                punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
                            }
                        }
                    } else { // in Rhino or a web browser
                        root.punycode = punycode;
                    }
                }(this));
            }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
        }, {}], 2: [function (_dereq_, module, exports) {
            var log = _dereq_('./log');
            
            function restoreOwnerScroll(ownerDocument, x, y) {
                if (ownerDocument.defaultView && (x !== ownerDocument.defaultView.pageXOffset || y !== ownerDocument.defaultView.pageYOffset)) {
                    ownerDocument.defaultView.scrollTo(x, y);
                }
            }
            
            function cloneCanvasContents(canvas, clonedCanvas) {
                try {
                    if (clonedCanvas) {
                        clonedCanvas.width = canvas.width;
                        clonedCanvas.height = canvas.height;
                        clonedCanvas.getContext("2d").putImageData(canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height), 0, 0);
                    }
                } catch (e) {
                    log("Unable to copy canvas content from", canvas, e);
                }
            }
            
            function cloneNode(node, javascriptEnabled) {
                var clone = node.nodeType === 3 ? document.createTextNode(node.nodeValue) : node.cloneNode(false);
                var child = node.firstChild;
                while (child) {
                    if (javascriptEnabled === true || child.nodeType !== 1 || child.nodeName !== 'SCRIPT') {
                        clone.appendChild(cloneNode(child, javascriptEnabled));
                    }
                    child = child.nextSibling;
                }
                if (node.nodeType === 1) {
                    clone._scrollTop = node.scrollTop;
                    clone._scrollLeft = node.scrollLeft;
                    if (node.nodeName === "CANVAS") {
                        cloneCanvasContents(node, clone);
                    } else if (node.nodeName === "TEXTAREA" || node.nodeName === "SELECT") {
                        clone.value = node.value;
                    }
                }
                return clone;
            }
            
            function initNode(node) {
                if (node.nodeType === 1) {
                    node.scrollTop = node._scrollTop;
                    node.scrollLeft = node._scrollLeft;
                    var child = node.firstChild;
                    while (child) {
                        initNode(child);
                        child = child.nextSibling;
                    }
                }
            }
            
            module.exports = function (ownerDocument, containerDocument, width, height, options, x, y) {
                var documentElement = cloneNode(ownerDocument.documentElement, options.javascriptEnabled);
                var container = containerDocument.createElement("iframe");
                container.className = "html2canvas-container";
                container.style.visibility = "hidden";
                container.style.position = "fixed";
                container.style.left = "-10000px";
                container.style.top = "0px";
                container.style.border = "0";
                container.width = width;
                container.height = height;
                container.scrolling = "no"; // ios won't scroll without it
                containerDocument.body.appendChild(container);
                return new Promise(function (resolve) {
                    var documentClone = container.contentWindow.document;
                    /* Chrome doesn't detect relative background-images assigned in inline <style> sheets when fetched through getComputedStyle
         if window url is about:blank, we can assign the url to current by writing onto the document
         */
                    container.contentWindow.onload = container.onload = function () {
                        var interval = setInterval(function () {
                            if (documentClone.body.childNodes.length > 0) {
                                initNode(documentClone.documentElement);
                                clearInterval(interval);
                                if (options.type === "view") {
                                    container.contentWindow.scrollTo(x, y);
                                    if ((/(iPad|iPhone|iPod)/g).test(navigator.userAgent) && (container.contentWindow.scrollY !== y || container.contentWindow.scrollX !== x)) {
                                        documentClone.documentElement.style.top = (-y) + "px";
                                        documentClone.documentElement.style.left = (-x) + "px";
                                        documentClone.documentElement.style.position = 'absolute';
                                    }
                                }
                                resolve(container);
                            }
                        }, 50);
                    };
                    documentClone.open();
                    documentClone.write("<!DOCTYPE html><html></html>");
                    // Chrome scrolls the parent document for some reason after the write to the cloned window???
                    restoreOwnerScroll(ownerDocument, x, y);
                    documentClone.replaceChild(documentClone.adoptNode(documentElement), documentClone.documentElement);
                    documentClone.close();
                });
            };
        }, {"./log": 13}], 3: [function (_dereq_, module, exports) {
// http://dev.w3.org/csswg/css-color/
            function Color(value) {
                this.r = 0;
                this.g = 0;
                this.b = 0;
                this.a = null;
                var result = this.fromArray(value) ||
                    this.namedColor(value) ||
                    this.rgb(value) ||
                    this.rgba(value) ||
                    this.hex6(value) ||
                    this.hex3(value);
            }
            
            Color.prototype.darken = function (amount) {
                var a = 1 - amount;
                return new Color([
                    Math.round(this.r * a),
                    Math.round(this.g * a),
                    Math.round(this.b * a),
                    this.a
                ]);
            };
            Color.prototype.isTransparent = function () {
                return this.a === 0;
            };
            Color.prototype.isBlack = function () {
                return this.r === 0 && this.g === 0 && this.b === 0;
            };
            Color.prototype.fromArray = function (array) {
                if (Array.isArray(array)) {
                    this.r = Math.min(array[0], 255);
                    this.g = Math.min(array[1], 255);
                    this.b = Math.min(array[2], 255);
                    if (array.length > 3) {
                        this.a = array[3];
                    }
                }
                return (Array.isArray(array));
            };
            var _hex3 = /^#([a-f0-9]{3})$/i;
            Color.prototype.hex3 = function (value) {
                var match = null;
                if ((match = value.match(_hex3)) !== null) {
                    this.r = parseInt(match[1][0] + match[1][0], 16);
                    this.g = parseInt(match[1][1] + match[1][1], 16);
                    this.b = parseInt(match[1][2] + match[1][2], 16);
                }
                return match !== null;
            };
            var _hex6 = /^#([a-f0-9]{6})$/i;
            Color.prototype.hex6 = function (value) {
                var match = null;
                if ((match = value.match(_hex6)) !== null) {
                    this.r = parseInt(match[1].substring(0, 2), 16);
                    this.g = parseInt(match[1].substring(2, 4), 16);
                    this.b = parseInt(match[1].substring(4, 6), 16);
                }
                return match !== null;
            };
            var _rgb = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
            Color.prototype.rgb = function (value) {
                var match = null;
                if ((match = value.match(_rgb)) !== null) {
                    this.r = Number(match[1]);
                    this.g = Number(match[2]);
                    this.b = Number(match[3]);
                }
                return match !== null;
            };
            var _rgba = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d?\.?\d+)\s*\)$/;
            Color.prototype.rgba = function (value) {
                var match = null;
                if ((match = value.match(_rgba)) !== null) {
                    this.r = Number(match[1]);
                    this.g = Number(match[2]);
                    this.b = Number(match[3]);
                    this.a = Number(match[4]);
                }
                return match !== null;
            };
            Color.prototype.toString = function () {
                return this.a !== null && this.a !== 1 ?
                    "rgba(" + [this.r, this.g, this.b, this.a].join(",") + ")" :
                    "rgb(" + [this.r, this.g, this.b].join(",") + ")";
            };
            Color.prototype.namedColor = function (value) {
                value = value.toLowerCase();
                var color = colors[value];
                if (color) {
                    this.r = color[0];
                    this.g = color[1];
                    this.b = color[2];
                } else if (value === "transparent") {
                    this.r = this.g = this.b = this.a = 0;
                    return true;
                }
                return !!color;
            };
            Color.prototype.isColor = true;
// JSON.stringify([].slice.call($$('.named-color-table tr'), 1).map(function(row) { return [row.childNodes[3].textContent, row.childNodes[5].textContent.trim().split(",").map(Number)] }).reduce(function(data, row) {data[row[0]] = row[1]; return data}, {}))
            var colors = {
                "aliceblue": [240, 248, 255],
                "antiquewhite": [250, 235, 215],
                "aqua": [0, 255, 255],
                "aquamarine": [127, 255, 212],
                "azure": [240, 255, 255],
                "beige": [245, 245, 220],
                "bisque": [255, 228, 196],
                "black": [0, 0, 0],
                "blanchedalmond": [255, 235, 205],
                "blue": [0, 0, 255],
                "blueviolet": [138, 43, 226],
                "brown": [165, 42, 42],
                "burlywood": [222, 184, 135],
                "cadetblue": [95, 158, 160],
                "chartreuse": [127, 255, 0],
                "chocolate": [210, 105, 30],
                "coral": [255, 127, 80],
                "cornflowerblue": [100, 149, 237],
                "cornsilk": [255, 248, 220],
                "crimson": [220, 20, 60],
                "cyan": [0, 255, 255],
                "darkblue": [0, 0, 139],
                "darkcyan": [0, 139, 139],
                "darkgoldenrod": [184, 134, 11],
                "darkgray": [169, 169, 169],
                "darkgreen": [0, 100, 0],
                "darkgrey": [169, 169, 169],
                "darkkhaki": [189, 183, 107],
                "darkmagenta": [139, 0, 139],
                "darkolivegreen": [85, 107, 47],
                "darkorange": [255, 140, 0],
                "darkorchid": [153, 50, 204],
                "darkred": [139, 0, 0],
                "darksalmon": [233, 150, 122],
                "darkseagreen": [143, 188, 143],
                "darkslateblue": [72, 61, 139],
                "darkslategray": [47, 79, 79],
                "darkslategrey": [47, 79, 79],
                "darkturquoise": [0, 206, 209],
                "darkviolet": [148, 0, 211],
                "deeppink": [255, 20, 147],
                "deepskyblue": [0, 191, 255],
                "dimgray": [105, 105, 105],
                "dimgrey": [105, 105, 105],
                "dodgerblue": [30, 144, 255],
                "firebrick": [178, 34, 34],
                "floralwhite": [255, 250, 240],
                "forestgreen": [34, 139, 34],
                "fuchsia": [255, 0, 255],
                "gainsboro": [220, 220, 220],
                "ghostwhite": [248, 248, 255],
                "gold": [255, 215, 0],
                "goldenrod": [218, 165, 32],
                "gray": [128, 128, 128],
                "green": [0, 128, 0],
                "greenyellow": [173, 255, 47],
                "grey": [128, 128, 128],
                "honeydew": [240, 255, 240],
                "hotpink": [255, 105, 180],
                "indianred": [205, 92, 92],
                "indigo": [75, 0, 130],
                "ivory": [255, 255, 240],
                "khaki": [240, 230, 140],
                "lavender": [230, 230, 250],
                "lavenderblush": [255, 240, 245],
                "lawngreen": [124, 252, 0],
                "lemonchiffon": [255, 250, 205],
                "lightblue": [173, 216, 230],
                "lightcoral": [240, 128, 128],
                "lightcyan": [224, 255, 255],
                "lightgoldenrodyellow": [250, 250, 210],
                "lightgray": [211, 211, 211],
                "lightgreen": [144, 238, 144],
                "lightgrey": [211, 211, 211],
                "lightpink": [255, 182, 193],
                "lightsalmon": [255, 160, 122],
                "lightseagreen": [32, 178, 170],
                "lightskyblue": [135, 206, 250],
                "lightslategray": [119, 136, 153],
                "lightslategrey": [119, 136, 153],
                "lightsteelblue": [176, 196, 222],
                "lightyellow": [255, 255, 224],
                "lime": [0, 255, 0],
                "limegreen": [50, 205, 50],
                "linen": [250, 240, 230],
                "magenta": [255, 0, 255],
                "maroon": [128, 0, 0],
                "mediumaquamarine": [102, 205, 170],
                "mediumblue": [0, 0, 205],
                "mediumorchid": [186, 85, 211],
                "mediumpurple": [147, 112, 219],
                "mediumseagreen": [60, 179, 113],
                "mediumslateblue": [123, 104, 238],
                "mediumspringgreen": [0, 250, 154],
                "mediumturquoise": [72, 209, 204],
                "mediumvioletred": [199, 21, 133],
                "midnightblue": [25, 25, 112],
                "mintcream": [245, 255, 250],
                "mistyrose": [255, 228, 225],
                "moccasin": [255, 228, 181],
                "navajowhite": [255, 222, 173],
                "navy": [0, 0, 128],
                "oldlace": [253, 245, 230],
                "olive": [128, 128, 0],
                "olivedrab": [107, 142, 35],
                "orange": [255, 165, 0],
                "orangered": [255, 69, 0],
                "orchid": [218, 112, 214],
                "palegoldenrod": [238, 232, 170],
                "palegreen": [152, 251, 152],
                "paleturquoise": [175, 238, 238],
                "palevioletred": [219, 112, 147],
                "papayawhip": [255, 239, 213],
                "peachpuff": [255, 218, 185],
                "peru": [205, 133, 63],
                "pink": [255, 192, 203],
                "plum": [221, 160, 221],
                "powderblue": [176, 224, 230],
                "purple": [128, 0, 128],
                "rebeccapurple": [102, 51, 153],
                "red": [255, 0, 0],
                "rosybrown": [188, 143, 143],
                "royalblue": [65, 105, 225],
                "saddlebrown": [139, 69, 19],
                "salmon": [250, 128, 114],
                "sandybrown": [244, 164, 96],
                "seagreen": [46, 139, 87],
                "seashell": [255, 245, 238],
                "sienna": [160, 82, 45],
                "silver": [192, 192, 192],
                "skyblue": [135, 206, 235],
                "slateblue": [106, 90, 205],
                "slategray": [112, 128, 144],
                "slategrey": [112, 128, 144],
                "snow": [255, 250, 250],
                "springgreen": [0, 255, 127],
                "steelblue": [70, 130, 180],
                "tan": [210, 180, 140],
                "teal": [0, 128, 128],
                "thistle": [216, 191, 216],
                "tomato": [255, 99, 71],
                "turquoise": [64, 224, 208],
                "violet": [238, 130, 238],
                "wheat": [245, 222, 179],
                "white": [255, 255, 255],
                "whitesmoke": [245, 245, 245],
                "yellow": [255, 255, 0],
                "yellowgreen": [154, 205, 50]
            };
            module.exports = Color;
        }, {}], 4: [function (_dereq_, module, exports) {
            var Support = _dereq_('./support');
            var CanvasRenderer = _dereq_('./renderers/canvas');
            var ImageLoader = _dereq_('./imageloader');
            var NodeParser = _dereq_('./nodeparser');
            var NodeContainer = _dereq_('./nodecontainer');
            var log = _dereq_('./log');
            var utils = _dereq_('./utils');
            var createWindowClone = _dereq_('./clone');
            var loadUrlDocument = _dereq_('./proxy').loadUrlDocument;
            var getBounds = utils.getBounds;
            var html2canvasNodeAttribute = "data-html2canvas-node";
            var html2canvasCloneIndex = 0;
            
            function html2canvas(nodeList, options) {
                var index = html2canvasCloneIndex++;
                options = options || {};
                if (options.logging) {
                    log.options.logging = true;
                    log.options.start = Date.now();
                }
                options.async = typeof(options.async) === "undefined" ? true : options.async;
                options.allowTaint = typeof(options.allowTaint) === "undefined" ? false : options.allowTaint;
                options.removeContainer = typeof(options.removeContainer) === "undefined" ? true : options.removeContainer;
                options.javascriptEnabled = typeof(options.javascriptEnabled) === "undefined" ? false : options.javascriptEnabled;
                options.imageTimeout = typeof(options.imageTimeout) === "undefined" ? 10000 : options.imageTimeout;
                options.renderer = typeof(options.renderer) === "function" ? options.renderer : CanvasRenderer;
                options.strict = !!options.strict;
                if (typeof(nodeList) === "string") {
                    if (typeof(options.proxy) !== "string") {
                        return Promise.reject("Proxy must be used when rendering url");
                    }
                    var width = options.width != null ? options.width : window.innerWidth;
                    var height = options.height != null ? options.height : window.innerHeight;
                    return loadUrlDocument(absoluteUrl(nodeList), options.proxy, document, width, height, options).then(function (container) {
                        return renderWindow(container.contentWindow.document.documentElement, container, options, width, height);
                    });
                }
                var node = ((nodeList === undefined) ? [document.documentElement] : ((nodeList.length) ? nodeList : [nodeList]))[0];
                node.setAttribute(html2canvasNodeAttribute + index, index);
                return renderDocument(node.ownerDocument, options, node.ownerDocument.defaultView.innerWidth, node.ownerDocument.defaultView.innerHeight, index).then(function (canvas) {
                    if (typeof(options.onrendered) === "function") {
                        log("options.onrendered is deprecated, html2canvas returns a Promise containing the canvas");
                        options.onrendered(canvas);
                    }
                    return canvas;
                });
            }
            
            html2canvas.CanvasRenderer = CanvasRenderer;
            html2canvas.NodeContainer = NodeContainer;
            html2canvas.log = log;
            html2canvas.utils = utils;
            var html2canvasExport = (typeof(document) === "undefined" || typeof(Object.create) !== "function" || typeof(document.createElement("canvas").getContext) !== "function") ? function () {
                return Promise.reject("No canvas support");
            } : html2canvas;
            module.exports = html2canvasExport;
            if (typeof(define) === 'function' && define.amd) {
                define('html2canvas', [], function () {
                    return html2canvasExport;
                });
            }
            
            function renderDocument(document, options, windowWidth, windowHeight, html2canvasIndex) {
                return createWindowClone(document, document, windowWidth, windowHeight, options, document.defaultView.pageXOffset, document.defaultView.pageYOffset).then(function (container) {
                    log("Document cloned");
                    var attributeName = html2canvasNodeAttribute + html2canvasIndex;
                    var selector = "[" + attributeName + "='" + html2canvasIndex + "']";
                    document.querySelector('.mod-dwg').removeAttribute(attributeName);
                    var clonedWindow = container.contentWindow;
                    var node = clonedWindow.document.querySelector('.mod-dwg');
                    var oncloneHandler = (typeof(options.onclone) === "function") ? Promise.resolve(options.onclone(clonedWindow.document)) : Promise.resolve(true);
                    return oncloneHandler.then(function () {
                        return renderWindow(node, container, options, windowWidth, windowHeight);
                    });
                });
            }
            
            function renderWindow(node, container, options, windowWidth, windowHeight) {
                var clonedWindow = container.contentWindow;
                var support = new Support(clonedWindow.document);
                var imageLoader = new ImageLoader(options, support);
                var bounds = getBounds(node);
                var width = options.type === "view" ? windowWidth : documentWidth(clonedWindow.document);
                var height = options.type === "view" ? windowHeight : documentHeight(clonedWindow.document);
                var renderer = new options.renderer(width, height, imageLoader, options, document);
                var parser = new NodeParser(node, renderer, support, imageLoader, options);
                return parser.ready.then(function () {
                    log("Finished rendering");
                    var canvas;
                    if (options.type === "view") {
                        canvas = crop(renderer.canvas, {
                            width: renderer.canvas.width, height: renderer.canvas.height, top: 0, left: 0, x: 0, y: 0
                        });
                    } else if (node === clonedWindow.document.body || node === clonedWindow.document.documentElement || options.canvas != null) {
                        canvas = renderer.canvas;
                    } else {
                        canvas = crop(renderer.canvas, {
                            width: options.width != null ? options.width : bounds.width,
                            height: options.height != null ? options.height : bounds.height, top: bounds.top,
                            left: bounds.left, x: 0, y: 0
                        });
                    }
                    cleanupContainer(container, options);
                    return canvas;
                });
            }
            
            function cleanupContainer(container, options) {
                if (options.removeContainer) {
                    container.parentNode.removeChild(container);
                    log("Cleaned up container");
                }
            }
            
            function crop(canvas, bounds) {
                var croppedCanvas = document.createElement("canvas");
                var x1 = Math.min(canvas.width - 1, Math.max(0, bounds.left));
                var x2 = Math.min(canvas.width, Math.max(1, bounds.left + bounds.width));
                var y1 = Math.min(canvas.height - 1, Math.max(0, bounds.top));
                var y2 = Math.min(canvas.height, Math.max(1, bounds.top + bounds.height));
                croppedCanvas.width = bounds.width;
                croppedCanvas.height = bounds.height;
                var width = x2 - x1;
                var height = y2 - y1;
                log("Cropping canvas at:", "left:", bounds.left, "top:", bounds.top, "width:", width, "height:", height);
                log("Resulting crop with width", bounds.width, "and height", bounds.height, "with x", x1, "and y", y1);
                croppedCanvas.getContext("2d").drawImage(canvas, x1, y1, width, height, bounds.x, bounds.y, width, height);
                return croppedCanvas;
            }
            
            function documentWidth(doc) {
                return Math.max(
                    Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth),
                    Math.max(doc.body.offsetWidth, doc.documentElement.offsetWidth),
                    Math.max(doc.body.clientWidth, doc.documentElement.clientWidth)
                );
            }
            
            function documentHeight(doc) {
                return Math.max(
                    Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight),
                    Math.max(doc.body.offsetHeight, doc.documentElement.offsetHeight),
                    Math.max(doc.body.clientHeight, doc.documentElement.clientHeight)
                );
            }
            
            function absoluteUrl(url) {
                var link = document.createElement("a");
                link.href = url;
                link.href = link.href;
                return link;
            }
        }, {
            "./clone": 2, "./imageloader": 11, "./log": 13, "./nodecontainer": 14, "./nodeparser": 15, "./proxy": 16,
            "./renderers/canvas": 20, "./support": 22, "./utils": 26
        }], 5: [function (_dereq_, module, exports) {
            var log = _dereq_('./log');
            var smallImage = _dereq_('./utils').smallImage;
            
            function DummyImageContainer(src) {
                this.src = src;
                log("DummyImageContainer for", src);
                if (!this.promise || !this.image) {
                    log("Initiating DummyImageContainer");
                    DummyImageContainer.prototype.image = new Image();
                    var image = this.image;
                    DummyImageContainer.prototype.promise = new Promise(function (resolve, reject) {
                        image.onload = resolve;
                        image.onerror = reject;
                        image.src = smallImage();
                        if (image.complete === true) {
                            resolve(image);
                        }
                    });
                }
            }
            
            module.exports = DummyImageContainer;
        }, {"./log": 13, "./utils": 26}], 6: [function (_dereq_, module, exports) {
            var smallImage = _dereq_('./utils').smallImage;
            
            function Font(family, size) {
                var container = document.createElement('div'),
                    img = document.createElement('img'),
                    span = document.createElement('span'),
                    sampleText = 'Hidden Text',
                    baseline,
                    middle;
                container.style.visibility = "hidden";
                container.style.fontFamily = family;
                container.style.fontSize = size;
                container.style.margin = 0;
                container.style.padding = 0;
                document.body.appendChild(container);
                img.src = smallImage();
                img.width = 1;
                img.height = 1;
                img.style.margin = 0;
                img.style.padding = 0;
                img.style.verticalAlign = "baseline";
                span.style.fontFamily = family;
                span.style.fontSize = size;
                span.style.margin = 0;
                span.style.padding = 0;
                span.appendChild(document.createTextNode(sampleText));
                container.appendChild(span);
                container.appendChild(img);
                baseline = (img.offsetTop - span.offsetTop) + 1;
                container.removeChild(span);
                container.appendChild(document.createTextNode(sampleText));
                container.style.lineHeight = "normal";
                img.style.verticalAlign = "super";
                middle = (img.offsetTop - container.offsetTop) + 1;
                document.body.removeChild(container);
                this.baseline = baseline;
                this.lineWidth = 1;
                this.middle = middle;
            }
            
            module.exports = Font;
        }, {"./utils": 26}], 7: [function (_dereq_, module, exports) {
            var Font = _dereq_('./font');
            
            function FontMetrics() {
                this.data = {};
            }
            
            FontMetrics.prototype.getMetrics = function (family, size) {
                if (this.data[family + "-" + size] === undefined) {
                    this.data[family + "-" + size] = new Font(family, size);
                }
                return this.data[family + "-" + size];
            };
            module.exports = FontMetrics;
        }, {"./font": 6}], 8: [function (_dereq_, module, exports) {
            var utils = _dereq_('./utils');
            var getBounds = utils.getBounds;
            var loadUrlDocument = _dereq_('./proxy').loadUrlDocument;
            
            function FrameContainer(container, sameOrigin, options) {
                this.image = null;
                this.src = container;
                var self = this;
                var bounds = getBounds(container);
                this.promise = (!sameOrigin ? this.proxyLoad(options.proxy, bounds, options) : new Promise(function (resolve) {
                    if (container.contentWindow.document.URL === "about:blank" || container.contentWindow.document.documentElement == null) {
                        container.contentWindow.onload = container.onload = function () {
                            resolve(container);
                        };
                    } else {
                        resolve(container);
                    }
                })).then(function (container) {
                    var html2canvas = _dereq_('./core');
                    return html2canvas(container.contentWindow.document.documentElement, {
                        type: 'view', width: container.width, height: container.height, proxy: options.proxy,
                        javascriptEnabled: options.javascriptEnabled, removeContainer: options.removeContainer,
                        allowTaint: options.allowTaint, imageTimeout: options.imageTimeout / 2
                    });
                }).then(function (canvas) {
                    return self.image = canvas;
                });
            }
            
            FrameContainer.prototype.proxyLoad = function (proxy, bounds, options) {
                var container = this.src;
                return loadUrlDocument(container.src, proxy, container.ownerDocument, bounds.width, bounds.height, options);
            };
            module.exports = FrameContainer;
        }, {"./core": 4, "./proxy": 16, "./utils": 26}], 9: [function (_dereq_, module, exports) {
            function GradientContainer(imageData) {
                this.src = imageData.value;
                this.colorStops = [];
                this.type = null;
                this.x0 = 0.5;
                this.y0 = 0.5;
                this.x1 = 0.5;
                this.y1 = 0.5;
                this.promise = Promise.resolve(true);
            }
            
            GradientContainer.TYPES = {
                LINEAR: 1,
                RADIAL: 2
            };
// TODO: support hsl[a], negative %/length values
// TODO: support <angle> (e.g. -?\d{1,3}(?:\.\d+)deg, etc. : https://developer.mozilla.org/docs/Web/CSS/angle )
            GradientContainer.REGEXP_COLORSTOP = /^\s*(rgba?\(\s*\d{1,3},\s*\d{1,3},\s*\d{1,3}(?:,\s*[0-9\.]+)?\s*\)|[a-z]{3,20}|#[a-f0-9]{3,6})(?:\s+(\d{1,3}(?:\.\d+)?)(%|px)?)?(?:\s|$)/i;
            module.exports = GradientContainer;
        }, {}], 10: [function (_dereq_, module, exports) {
            function ImageContainer(src, cors) {
                this.src = src;
                this.image = new Image();
                var self = this;
                this.tainted = null;
                this.promise = new Promise(function (resolve, reject) {
                    self.image.onload = resolve;
                    self.image.onerror = reject;
                    if (cors) {
                        self.image.crossOrigin = "anonymous";
                    }
                    self.image.src = src;
                    if (self.image.complete === true) {
                        resolve(self.image);
                    }
                });
            }
            
            module.exports = ImageContainer;
        }, {}], 11: [function (_dereq_, module, exports) {
            var log = _dereq_('./log');
            var ImageContainer = _dereq_('./imagecontainer');
            var DummyImageContainer = _dereq_('./dummyimagecontainer');
            var ProxyImageContainer = _dereq_('./proxyimagecontainer');
            var FrameContainer = _dereq_('./framecontainer');
            var SVGContainer = _dereq_('./svgcontainer');
            var SVGNodeContainer = _dereq_('./svgnodecontainer');
            var LinearGradientContainer = _dereq_('./lineargradientcontainer');
            var WebkitGradientContainer = _dereq_('./webkitgradientcontainer');
            var bind = _dereq_('./utils').bind;
            
            function ImageLoader(options, support) {
                this.link = null;
                this.options = options;
                this.support = support;
                this.origin = this.getOrigin(window.location.href);
            }
            
            ImageLoader.prototype.findImages = function (nodes) {
                var images = [];
                nodes.reduce(function (imageNodes, container) {
                    switch (container.node.nodeName) {
                        case "IMG":
                            return imageNodes.concat([{
                                args: [container.node.src],
                                method: "url"
                            }]);
                        case "svg":
                        case "IFRAME":
                            return imageNodes.concat([{
                                args: [container.node],
                                method: container.node.nodeName
                            }]);
                    }
                    return imageNodes;
                }, []).forEach(this.addImage(images, this.loadImage), this);
                return images;
            };
            ImageLoader.prototype.findBackgroundImage = function (images, container) {
                container.parseBackgroundImages().filter(this.hasImageBackground).forEach(this.addImage(images, this.loadImage), this);
                return images;
            };
            ImageLoader.prototype.addImage = function (images, callback) {
                return function (newImage) {
                    newImage.args.forEach(function (image) {
                        if (!this.imageExists(images, image)) {
                            images.splice(0, 0, callback.call(this, newImage));
                            log('Added image #' + (images.length), typeof(image) === "string" ? image.substring(0, 100) : image);
                        }
                    }, this);
                };
            };
            ImageLoader.prototype.hasImageBackground = function (imageData) {
                return imageData.method !== "none";
            };
            ImageLoader.prototype.loadImage = function (imageData) {
                if (imageData.method === "url") {
                    var src = imageData.args[0];
                    if (this.isSVG(src) && !this.support.svg && !this.options.allowTaint) {
                        return new SVGContainer(src);
                    } else if (src.match(/data:image\/.*;base64,/i)) {
                        return new ImageContainer(src.replace(/url\(['"]{0,}|['"]{0,}\)$/ig, ''), false);
                    } else if (this.isSameOrigin(src) || this.options.allowTaint === true || this.isSVG(src)) {
                        return new ImageContainer(src, false);
                    } else if (this.support.cors && !this.options.allowTaint && this.options.useCORS) {
                        return new ImageContainer(src, true);
                    } else if (this.options.proxy) {
                        return new ProxyImageContainer(src, this.options.proxy);
                    } else {
                        return new DummyImageContainer(src);
                    }
                } else if (imageData.method === "linear-gradient") {
                    return new LinearGradientContainer(imageData);
                } else if (imageData.method === "gradient") {
                    return new WebkitGradientContainer(imageData);
                } else if (imageData.method === "svg") {
                    return new SVGNodeContainer(imageData.args[0], this.support.svg);
                } else if (imageData.method === "IFRAME") {
                    return new FrameContainer(imageData.args[0], this.isSameOrigin(imageData.args[0].src), this.options);
                } else {
                    return new DummyImageContainer(imageData);
                }
            };
            ImageLoader.prototype.isSVG = function (src) {
                return src.substring(src.length - 3).toLowerCase() === "svg" || SVGContainer.prototype.isInline(src);
            };
            ImageLoader.prototype.imageExists = function (images, src) {
                return images.some(function (image) {
                    return image.src === src;
                });
            };
            ImageLoader.prototype.isSameOrigin = function (url) {
                return (this.getOrigin(url) === this.origin);
            };
            ImageLoader.prototype.getOrigin = function (url) {
                var link = this.link || (this.link = document.createElement("a"));
                link.href = url;
                link.href = link.href; // IE9, LOL! - http://jsfiddle.net/niklasvh/2e48b/
                return link.protocol + link.hostname + link.port;
            };
            ImageLoader.prototype.getPromise = function (container) {
                return this.timeout(container, this.options.imageTimeout)['catch'](function () {
                    var dummy = new DummyImageContainer(container.src);
                    return dummy.promise.then(function (image) {
                        container.image = image;
                    });
                });
            };
            ImageLoader.prototype.get = function (src) {
                var found = null;
                return this.images.some(function (img) {
                    return (found = img).src === src;
                }) ? found : null;
            };
            ImageLoader.prototype.fetch = function (nodes) {
                this.images = nodes.reduce(bind(this.findBackgroundImage, this), this.findImages(nodes));
                this.images.forEach(function (image, index) {
                    image.promise.then(function () {
                        log("Succesfully loaded image #" + (index + 1), image);
                    }, function (e) {
                        log("Failed loading image #" + (index + 1), image, e);
                    });
                });
                this.ready = Promise.all(this.images.map(this.getPromise, this));
                log("Finished searching images");
                return this;
            };
            ImageLoader.prototype.timeout = function (container, timeout) {
                var timer;
                var promise = Promise.race([container.promise, new Promise(function (res, reject) {
                    timer = setTimeout(function () {
                        log("Timed out loading image", container);
                        reject(container);
                    }, timeout);
                })]).then(function (container) {
                    clearTimeout(timer);
                    return container;
                });
                promise['catch'](function () {
                    clearTimeout(timer);
                });
                return promise;
            };
            module.exports = ImageLoader;
        }, {
            "./dummyimagecontainer": 5, "./framecontainer": 8, "./imagecontainer": 10, "./lineargradientcontainer": 12,
            "./log": 13, "./proxyimagecontainer": 17, "./svgcontainer": 23, "./svgnodecontainer": 24, "./utils": 26,
            "./webkitgradientcontainer": 27
        }], 12: [function (_dereq_, module, exports) {
            var GradientContainer = _dereq_('./gradientcontainer');
            var Color = _dereq_('./color');
            
            function LinearGradientContainer(imageData) {
                GradientContainer.apply(this, arguments);
                this.type = GradientContainer.TYPES.LINEAR;
                var hasDirection = LinearGradientContainer.REGEXP_DIRECTION.test(imageData.args[0]) ||
                    !GradientContainer.REGEXP_COLORSTOP.test(imageData.args[0]);
                if (hasDirection) {
                    imageData.args[0].split(/\s+/).reverse().forEach(function (position, index) {
                        switch (position) {
                            case "left":
                                this.x0 = 0;
                                this.x1 = 1;
                                break;
                            case "top":
                                this.y0 = 0;
                                this.y1 = 1;
                                break;
                            case "right":
                                this.x0 = 1;
                                this.x1 = 0;
                                break;
                            case "bottom":
                                this.y0 = 1;
                                this.y1 = 0;
                                break;
                            case "to":
                                var y0 = this.y0;
                                var x0 = this.x0;
                                this.y0 = this.y1;
                                this.x0 = this.x1;
                                this.x1 = x0;
                                this.y1 = y0;
                                break;
                            case "center":
                                break; // centered by default
                            // Firefox internally converts position keywords to percentages:
                            // http://www.w3.org/TR/2010/WD-CSS2-20101207/colors.html#propdef-background-position
                            default: // percentage or absolute length
                                // TODO: support absolute start point positions (e.g., use bounds to convert px to a ratio)
                                var ratio = parseFloat(position, 10) * 1e-2;
                                if (isNaN(ratio)) { // invalid or unhandled value
                                    break;
                                }
                                if (index === 0) {
                                    this.y0 = ratio;
                                    this.y1 = 1 - this.y0;
                                } else {
                                    this.x0 = ratio;
                                    this.x1 = 1 - this.x0;
                                }
                                break;
                        }
                    }, this);
                } else {
                    this.y0 = 0;
                    this.y1 = 1;
                }
                this.colorStops = imageData.args.slice(hasDirection ? 1 : 0).map(function (colorStop) {
                    var colorStopMatch = colorStop.match(GradientContainer.REGEXP_COLORSTOP);
                    var value = +colorStopMatch[2];
                    var unit = value === 0 ? "%" : colorStopMatch[3]; // treat "0" as "0%"
                    return {
                        color: new Color(colorStopMatch[1]),
                        // TODO: support absolute stop positions (e.g., compute gradient line length & convert px to ratio)
                        stop: unit === "%" ? value / 100 : null
                    };
                });
                if (this.colorStops[0].stop === null) {
                    this.colorStops[0].stop = 0;
                }
                if (this.colorStops[this.colorStops.length - 1].stop === null) {
                    this.colorStops[this.colorStops.length - 1].stop = 1;
                }
                // calculates and fills-in explicit stop positions when omitted from rule
                this.colorStops.forEach(function (colorStop, index) {
                    if (colorStop.stop === null) {
                        this.colorStops.slice(index).some(function (find, count) {
                            if (find.stop !== null) {
                                colorStop.stop = ((find.stop - this.colorStops[index - 1].stop) / (count + 1)) + this.colorStops[index - 1].stop;
                                return true;
                            } else {
                                return false;
                            }
                        }, this);
                    }
                }, this);
            }
            
            LinearGradientContainer.prototype = Object.create(GradientContainer.prototype);
// TODO: support <angle> (e.g. -?\d{1,3}(?:\.\d+)deg, etc. : https://developer.mozilla.org/docs/Web/CSS/angle )
            LinearGradientContainer.REGEXP_DIRECTION = /^\s*(?:to|left|right|top|bottom|center|\d{1,3}(?:\.\d+)?%?)(?:\s|$)/i;
            module.exports = LinearGradientContainer;
        }, {"./color": 3, "./gradientcontainer": 9}], 13: [function (_dereq_, module, exports) {
            var logger = function () {
                if (logger.options.logging && window.console && window.console.log) {
                    Function.prototype.bind.call(window.console.log, (window.console)).apply(window.console, [(Date.now() - logger.options.start) + "ms", "html2canvas:"].concat([].slice.call(arguments, 0)));
                }
            };
            logger.options = {logging: false};
            module.exports = logger;
        }, {}], 14: [function (_dereq_, module, exports) {
            var Color = _dereq_('./color');
            var utils = _dereq_('./utils');
            var getBounds = utils.getBounds;
            var parseBackgrounds = utils.parseBackgrounds;
            var offsetBounds = utils.offsetBounds;
            
            function NodeContainer(node, parent) {
                this.node = node;
                this.parent = parent;
                this.stack = null;
                this.bounds = null;
                this.borders = null;
                this.clip = [];
                this.backgroundClip = [];
                this.offsetBounds = null;
                this.visible = null;
                this.computedStyles = null;
                this.colors = {};
                this.styles = {};
                this.backgroundImages = null;
                this.transformData = null;
                this.transformMatrix = null;
                this.isPseudoElement = false;
                this.opacity = null;
            }
            
            NodeContainer.prototype.cloneTo = function (stack) {
                stack.visible = this.visible;
                stack.borders = this.borders;
                stack.bounds = this.bounds;
                stack.clip = this.clip;
                stack.backgroundClip = this.backgroundClip;
                stack.computedStyles = this.computedStyles;
                stack.styles = this.styles;
                stack.backgroundImages = this.backgroundImages;
                stack.opacity = this.opacity;
            };
            NodeContainer.prototype.getOpacity = function () {
                return this.opacity === null ? (this.opacity = this.cssFloat('opacity')) : this.opacity;
            };
            NodeContainer.prototype.assignStack = function (stack) {
                this.stack = stack;
                stack.children.push(this);
            };
            NodeContainer.prototype.isElementVisible = function () {
                return this.node.nodeType === Node.TEXT_NODE ? this.parent.visible : (
                    this.css('display') !== "none" &&
                    this.css('visibility') !== "hidden" &&
                    !this.node.hasAttribute("data-html2canvas-ignore") &&
                    (this.node.nodeName !== "INPUT" || this.node.getAttribute("type") !== "hidden")
                );
            };
            NodeContainer.prototype.css = function (attribute) {
                if (!this.computedStyles) {
                    this.computedStyles = this.isPseudoElement ? this.parent.computedStyle(this.before ? ":before" : ":after") : this.computedStyle(null);
                }
                return this.styles[attribute] || (this.styles[attribute] = this.computedStyles[attribute]);
            };
            NodeContainer.prototype.prefixedCss = function (attribute) {
                var prefixes = ["webkit", "moz", "ms", "o"];
                var value = this.css(attribute);
                if (value === undefined) {
                    prefixes.some(function (prefix) {
                        value = this.css(prefix + attribute.substr(0, 1).toUpperCase() + attribute.substr(1));
                        return value !== undefined;
                    }, this);
                }
                return value === undefined ? null : value;
            };
            NodeContainer.prototype.computedStyle = function (type) {
                return this.node.ownerDocument.defaultView.getComputedStyle(this.node, type);
            };
            NodeContainer.prototype.cssInt = function (attribute) {
                var value = parseInt(this.css(attribute), 10);
                return (isNaN(value)) ? 0 : value; // borders in old IE are throwing 'medium' for demo.html
            };
            NodeContainer.prototype.color = function (attribute) {
                return this.colors[attribute] || (this.colors[attribute] = new Color(this.css(attribute)));
            };
            NodeContainer.prototype.cssFloat = function (attribute) {
                var value = parseFloat(this.css(attribute));
                return (isNaN(value)) ? 0 : value;
            };
            NodeContainer.prototype.fontWeight = function () {
                var weight = this.css("fontWeight");
                switch (parseInt(weight, 10)) {
                    case 401:
                        weight = "bold";
                        break;
                    case 400:
                        weight = "normal";
                        break;
                }
                return weight;
            };
            NodeContainer.prototype.parseClip = function () {
                var matches = this.css('clip').match(this.CLIP);
                if (matches) {
                    return {
                        top: parseInt(matches[1], 10),
                        right: parseInt(matches[2], 10),
                        bottom: parseInt(matches[3], 10),
                        left: parseInt(matches[4], 10)
                    };
                }
                return null;
            };
            NodeContainer.prototype.parseBackgroundImages = function () {
                return this.backgroundImages || (this.backgroundImages = parseBackgrounds(this.css("backgroundImage")));
            };
            NodeContainer.prototype.cssList = function (property, index) {
                var value = (this.css(property) || '').split(',');
                value = value[index || 0] || value[0] || 'auto';
                value = value.trim().split(' ');
                if (value.length === 1) {
                    value = [value[0], isPercentage(value[0]) ? 'auto' : value[0]];
                }
                return value;
            };
            NodeContainer.prototype.parseBackgroundSize = function (bounds, image, index) {
                var size = this.cssList("backgroundSize", index);
                var width, height;
                if (isPercentage(size[0])) {
                    width = bounds.width * parseFloat(size[0]) / 100;
                } else if (/contain|cover/.test(size[0])) {
                    var targetRatio = bounds.width / bounds.height, currentRatio = image.width / image.height;
                    return (targetRatio < currentRatio ^ size[0] === 'contain') ? {
                        width: bounds.height * currentRatio, height: bounds.height
                    } : {width: bounds.width, height: bounds.width / currentRatio};
                } else {
                    width = parseInt(size[0], 10);
                }
                if (size[0] === 'auto' && size[1] === 'auto') {
                    height = image.height;
                } else if (size[1] === 'auto') {
                    height = width / image.width * image.height;
                } else if (isPercentage(size[1])) {
                    height = bounds.height * parseFloat(size[1]) / 100;
                } else {
                    height = parseInt(size[1], 10);
                }
                if (size[0] === 'auto') {
                    width = height / image.height * image.width;
                }
                return {width: width, height: height};
            };
            NodeContainer.prototype.parseBackgroundPosition = function (bounds, image, index, backgroundSize) {
                var position = this.cssList('backgroundPosition', index);
                var left, top;
                if (isPercentage(position[0])) {
                    left = (bounds.width - (backgroundSize || image).width) * (parseFloat(position[0]) / 100);
                } else {
                    left = parseInt(position[0], 10);
                }
                if (position[1] === 'auto') {
                    top = left / image.width * image.height;
                } else if (isPercentage(position[1])) {
                    top = (bounds.height - (backgroundSize || image).height) * parseFloat(position[1]) / 100;
                } else {
                    top = parseInt(position[1], 10);
                }
                if (position[0] === 'auto') {
                    left = top / image.height * image.width;
                }
                return {left: left, top: top};
            };
            NodeContainer.prototype.parseBackgroundRepeat = function (index) {
                return this.cssList("backgroundRepeat", index)[0];
            };
            NodeContainer.prototype.parseTextShadows = function () {
                var textShadow = this.css("textShadow");
                var results = [];
                if (textShadow && textShadow !== 'none') {
                    var shadows = textShadow.match(this.TEXT_SHADOW_PROPERTY);
                    for (var i = 0; shadows && (i < shadows.length); i++) {
                        var s = shadows[i].match(this.TEXT_SHADOW_VALUES);
                        results.push({
                            color: new Color(s[0]),
                            offsetX: s[1] ? parseFloat(s[1].replace('px', '')) : 0,
                            offsetY: s[2] ? parseFloat(s[2].replace('px', '')) : 0,
                            blur: s[3] ? s[3].replace('px', '') : 0
                        });
                    }
                }
                return results;
            };
            NodeContainer.prototype.parseTransform = function () {
                if (!this.transformData) {
                    if (this.hasTransform()) {
                        var offset = this.parseBounds();
                        var origin = this.prefixedCss("transformOrigin").split(" ").map(removePx).map(asFloat);
                        origin[0] += offset.left;
                        origin[1] += offset.top;
                        this.transformData = {
                            origin: origin,
                            matrix: this.parseTransformMatrix()
                        };
                    } else {
                        this.transformData = {
                            origin: [0, 0],
                            matrix: [1, 0, 0, 1, 0, 0]
                        };
                    }
                }
                return this.transformData;
            };
            NodeContainer.prototype.parseTransformMatrix = function () {
                if (!this.transformMatrix) {
                    var transform = this.prefixedCss("transform");
                    var matrix = transform ? parseMatrix(transform.match(this.MATRIX_PROPERTY)) : null;
                    this.transformMatrix = matrix ? matrix : [1, 0, 0, 1, 0, 0];
                }
                return this.transformMatrix;
            };
            NodeContainer.prototype.parseBounds = function () {
                return this.bounds || (this.bounds = this.hasTransform() ? offsetBounds(this.node) : getBounds(this.node));
            };
            NodeContainer.prototype.hasTransform = function () {
                return this.parseTransformMatrix().join(",") !== "1,0,0,1,0,0" || (this.parent && this.parent.hasTransform());
            };
            NodeContainer.prototype.getValue = function () {
                var value = this.node.value || "";
                if (this.node.tagName === "SELECT") {
                    value = selectionValue(this.node);
                } else if (this.node.type === "password") {
                    value = Array(value.length + 1).join('\u2022'); // jshint ignore:line
                }
                return value.length === 0 ? (this.node.placeholder || "") : value;
            };
            NodeContainer.prototype.MATRIX_PROPERTY = /(matrix|matrix3d)\((.+)\)/;
            NodeContainer.prototype.TEXT_SHADOW_PROPERTY = /((rgba|rgb)\([^\)]+\)(\s-?\d+px){0,})/g;
            NodeContainer.prototype.TEXT_SHADOW_VALUES = /(-?\d+px)|(#.+)|(rgb\(.+\))|(rgba\(.+\))/g;
            NodeContainer.prototype.CLIP = /^rect\((\d+)px,? (\d+)px,? (\d+)px,? (\d+)px\)$/;
            
            function selectionValue(node) {
                var option = node.options[node.selectedIndex || 0];
                return option ? (option.text || "") : "";
            }
            
            function parseMatrix(match) {
                if (match && match[1] === "matrix") {
                    return match[2].split(",").map(function (s) {
                        return parseFloat(s.trim());
                    });
                } else if (match && match[1] === "matrix3d") {
                    var matrix3d = match[2].split(",").map(function (s) {
                        return parseFloat(s.trim());
                    });
                    return [matrix3d[0], matrix3d[1], matrix3d[4], matrix3d[5], matrix3d[12], matrix3d[13]];
                }
            }
            
            function isPercentage(value) {
                return value.toString().indexOf("%") !== -1;
            }
            
            function removePx(str) {
                return str.replace("px", "");
            }
            
            function asFloat(str) {
                return parseFloat(str);
            }
            
            module.exports = NodeContainer;
        }, {"./color": 3, "./utils": 26}], 15: [function (_dereq_, module, exports) {
            var log = _dereq_('./log');
            var punycode = _dereq_('punycode');
            var NodeContainer = _dereq_('./nodecontainer');
            var TextContainer = _dereq_('./textcontainer');
            var PseudoElementContainer = _dereq_('./pseudoelementcontainer');
            var FontMetrics = _dereq_('./fontmetrics');
            var Color = _dereq_('./color');
            var StackingContext = _dereq_('./stackingcontext');
            var utils = _dereq_('./utils');
            var bind = utils.bind;
            var getBounds = utils.getBounds;
            var parseBackgrounds = utils.parseBackgrounds;
            var offsetBounds = utils.offsetBounds;
            
            function NodeParser(element, renderer, support, imageLoader, options) {
                log("Starting NodeParser");
                this.renderer = renderer;
                this.options = options;
                this.range = null;
                this.support = support;
                this.renderQueue = [];
                this.stack = new StackingContext(true, 1, element.ownerDocument, null);
                var parent = new NodeContainer(element, null);
                if (options.background) {
                    renderer.rectangle(0, 0, renderer.width, renderer.height, new Color(options.background));
                }
                if (element === element.ownerDocument.documentElement) {
                    // http://www.w3.org/TR/css3-background/#special-backgrounds
                    var canvasBackground = new NodeContainer(parent.color('backgroundColor').isTransparent() ? element.ownerDocument.body : element.ownerDocument.documentElement, null);
                    renderer.rectangle(0, 0, renderer.width, renderer.height, canvasBackground.color('backgroundColor'));
                }
                parent.visibile = parent.isElementVisible();
                this.createPseudoHideStyles(element.ownerDocument);
                this.disableAnimations(element.ownerDocument);
                this.nodes = flatten([parent].concat(this.getChildren(parent)).filter(function (container) {
                    return container.visible = container.isElementVisible();
                }).map(this.getPseudoElements, this));
                this.fontMetrics = new FontMetrics();
                log("Fetched nodes, total:", this.nodes.length);
                log("Calculate overflow clips");
                this.calculateOverflowClips();
                log("Start fetching images");
                this.images = imageLoader.fetch(this.nodes.filter(isElement));
                this.ready = this.images.ready.then(bind(function () {
                    log("Images loaded, starting parsing");
                    log("Creating stacking contexts");
                    this.createStackingContexts();
                    log("Sorting stacking contexts");
                    this.sortStackingContexts(this.stack);
                    this.parse(this.stack);
                    log("Render queue created with " + this.renderQueue.length + " items");
                    return new Promise(bind(function (resolve) {
                        if (!options.async) {
                            this.renderQueue.forEach(this.paint, this);
                            resolve();
                        } else if (typeof(options.async) === "function") {
                            options.async.call(this, this.renderQueue, resolve);
                        } else if (this.renderQueue.length > 0) {
                            this.renderIndex = 0;
                            this.asyncRenderer(this.renderQueue, resolve);
                        } else {
                            resolve();
                        }
                    }, this));
                }, this));
            }
            
            NodeParser.prototype.calculateOverflowClips = function () {
                this.nodes.forEach(function (container) {
                    if (isElement(container)) {
                        if (isPseudoElement(container)) {
                            container.appendToDOM();
                        }
                        container.borders = this.parseBorders(container);
                        var clip = (container.css('overflow') === "hidden") ? [container.borders.clip] : [];
                        var cssClip = container.parseClip();
                        if (cssClip && ["absolute", "fixed"].indexOf(container.css('position')) !== -1) {
                            clip.push([["rect",
                                container.bounds.left + cssClip.left,
                                container.bounds.top + cssClip.top,
                                cssClip.right - cssClip.left,
                                cssClip.bottom - cssClip.top
                            ]]);
                        }
                        container.clip = hasParentClip(container) ? container.parent.clip.concat(clip) : clip;
                        container.backgroundClip = (container.css('overflow') !== "hidden") ? container.clip.concat([container.borders.clip]) : container.clip;
                        if (isPseudoElement(container)) {
                            container.cleanDOM();
                        }
                    } else if (isTextNode(container)) {
                        container.clip = hasParentClip(container) ? container.parent.clip : [];
                    }
                    if (!isPseudoElement(container)) {
                        container.bounds = null;
                    }
                }, this);
            };
            
            function hasParentClip(container) {
                return container.parent && container.parent.clip.length;
            }
            
            NodeParser.prototype.asyncRenderer = function (queue, resolve, asyncTimer) {
                asyncTimer = asyncTimer || Date.now();
                this.paint(queue[this.renderIndex++]);
                if (queue.length === this.renderIndex) {
                    resolve();
                } else if (asyncTimer + 20 > Date.now()) {
                    this.asyncRenderer(queue, resolve, asyncTimer);
                } else {
                    setTimeout(bind(function () {
                        this.asyncRenderer(queue, resolve);
                    }, this), 0);
                }
            };
            NodeParser.prototype.createPseudoHideStyles = function (document) {
                this.createStyles(document, '.' + PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + ':before { content: "" !important; display: none !important; }' +
                    '.' + PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER + ':after { content: "" !important; display: none !important; }');
            };
            NodeParser.prototype.disableAnimations = function (document) {
                this.createStyles(document, '* { -webkit-animation: none !important; -moz-animation: none !important; -o-animation: none !important; animation: none !important; ' +
                    '-webkit-transition: none !important; -moz-transition: none !important; -o-transition: none !important; transition: none !important;}');
            };
            NodeParser.prototype.createStyles = function (document, styles) {
                var hidePseudoElements = document.createElement('style');
                hidePseudoElements.innerHTML = styles;
                document.body.appendChild(hidePseudoElements);
            };
            NodeParser.prototype.getPseudoElements = function (container) {
                var nodes = [[container]];
                if (container.node.nodeType === Node.ELEMENT_NODE) {
                    var before = this.getPseudoElement(container, ":before");
                    var after = this.getPseudoElement(container, ":after");
                    if (before) {
                        nodes.push(before);
                    }
                    if (after) {
                        nodes.push(after);
                    }
                }
                return flatten(nodes);
            };
            
            function toCamelCase(str) {
                return str.replace(/(\-[a-z])/g, function (match) {
                    return match.toUpperCase().replace('-', '');
                });
            }
            
            NodeParser.prototype.getPseudoElement = function (container, type) {
                var style = container.computedStyle(type);
                if (!style || !style.content || style.content === "none" || style.content === "-moz-alt-content" || style.display === "none") {
                    return null;
                }
                var content = stripQuotes(style.content);
                var isImage = content.substr(0, 3) === 'url';
                var pseudoNode = document.createElement(isImage ? 'img' : 'html2canvaspseudoelement');
                var pseudoContainer = new PseudoElementContainer(pseudoNode, container, type);
                for (var i = style.length - 1; i >= 0; i--) {
                    var property = toCamelCase(style.item(i));
                    pseudoNode.style[property] = style[property];
                }
                pseudoNode.className = PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + " " + PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER;
                if (isImage) {
                    pseudoNode.src = parseBackgrounds(content)[0].args[0];
                    return [pseudoContainer];
                } else {
                    var text = document.createTextNode(content);
                    pseudoNode.appendChild(text);
                    return [pseudoContainer, new TextContainer(text, pseudoContainer)];
                }
            };
            NodeParser.prototype.getChildren = function (parentContainer) {
                return flatten([].filter.call(parentContainer.node.childNodes, renderableNode).map(function (node) {
                    var container = [node.nodeType === Node.TEXT_NODE ? new TextContainer(node, parentContainer) : new NodeContainer(node, parentContainer)].filter(nonIgnoredElement);
                    return node.nodeType === Node.ELEMENT_NODE && container.length && node.tagName !== "TEXTAREA" ? (container[0].isElementVisible() ? container.concat(this.getChildren(container[0])) : []) : container;
                }, this));
            };
            NodeParser.prototype.newStackingContext = function (container, hasOwnStacking) {
                var stack = new StackingContext(hasOwnStacking, container.getOpacity(), container.node, container.parent);
                container.cloneTo(stack);
                var parentStack = hasOwnStacking ? stack.getParentStack(this) : stack.parent.stack;
                parentStack.contexts.push(stack);
                container.stack = stack;
            };
            NodeParser.prototype.createStackingContexts = function () {
                this.nodes.forEach(function (container) {
                    if (isElement(container) && (this.isRootElement(container) || hasOpacity(container) || isPositionedForStacking(container) || this.isBodyWithTransparentRoot(container) || container.hasTransform())) {
                        this.newStackingContext(container, true);
                    } else if (isElement(container) && ((isPositioned(container) && zIndex0(container)) || isInlineBlock(container) || isFloating(container))) {
                        this.newStackingContext(container, false);
                    } else {
                        container.assignStack(container.parent.stack);
                    }
                }, this);
            };
            NodeParser.prototype.isBodyWithTransparentRoot = function (container) {
                return container.node.nodeName === "BODY" && container.parent.color('backgroundColor').isTransparent();
            };
            NodeParser.prototype.isRootElement = function (container) {
                return container.parent === null;
            };
            NodeParser.prototype.sortStackingContexts = function (stack) {
                stack.contexts.sort(zIndexSort(stack.contexts.slice(0)));
                stack.contexts.forEach(this.sortStackingContexts, this);
            };
            NodeParser.prototype.parseTextBounds = function (container) {
                return function (text, index, textList) {
                    if (container.parent.css("textDecoration").substr(0, 4) !== "none" || text.trim().length !== 0) {
                        if (this.support.rangeBounds && !container.parent.hasTransform()) {
                            var offset = textList.slice(0, index).join("").length;
                            return this.getRangeBounds(container.node, offset, text.length);
                        } else if (container.node && typeof(container.node.data) === "string") {
                            var replacementNode = container.node.splitText(text.length);
                            var bounds = this.getWrapperBounds(container.node, container.parent.hasTransform());
                            container.node = replacementNode;
                            return bounds;
                        }
                    } else if (!this.support.rangeBounds || container.parent.hasTransform()) {
                        container.node = container.node.splitText(text.length);
                    }
                    return {};
                };
            };
            NodeParser.prototype.getWrapperBounds = function (node, transform) {
                var wrapper = node.ownerDocument.createElement('html2canvaswrapper');
                var parent = node.parentNode,
                    backupText = node.cloneNode(true);
                wrapper.appendChild(node.cloneNode(true));
                parent.replaceChild(wrapper, node);
                var bounds = transform ? offsetBounds(wrapper) : getBounds(wrapper);
                parent.replaceChild(backupText, wrapper);
                return bounds;
            };
            NodeParser.prototype.getRangeBounds = function (node, offset, length) {
                var range = this.range || (this.range = node.ownerDocument.createRange());
                range.setStart(node, offset);
                range.setEnd(node, offset + length);
                return range.getBoundingClientRect();
            };
            
            function ClearTransform() {
            }
            
            NodeParser.prototype.parse = function (stack) {
                // http://www.w3.org/TR/CSS21/visuren.html#z-index
                var negativeZindex = stack.contexts.filter(negativeZIndex); // 2. the child stacking contexts with negative stack levels (most negative first).
                var descendantElements = stack.children.filter(isElement);
                var descendantNonFloats = descendantElements.filter(not(isFloating));
                var nonInlineNonPositionedDescendants = descendantNonFloats.filter(not(isPositioned)).filter(not(inlineLevel)); // 3 the in-flow, non-inline-level, non-positioned descendants.
                var nonPositionedFloats = descendantElements.filter(not(isPositioned)).filter(isFloating); // 4. the non-positioned floats.
                var inFlow = descendantNonFloats.filter(not(isPositioned)).filter(inlineLevel); // 5. the in-flow, inline-level, non-positioned descendants, including inline tables and inline blocks.
                var stackLevel0 = stack.contexts.concat(descendantNonFloats.filter(isPositioned)).filter(zIndex0); // 6. the child stacking contexts with stack level 0 and the positioned descendants with stack level 0.
                var text = stack.children.filter(isTextNode).filter(hasText);
                var positiveZindex = stack.contexts.filter(positiveZIndex); // 7. the child stacking contexts with positive stack levels (least positive first).
                negativeZindex.concat(nonInlineNonPositionedDescendants).concat(nonPositionedFloats)
                    .concat(inFlow).concat(stackLevel0).concat(text).concat(positiveZindex).forEach(function (container) {
                    this.renderQueue.push(container);
                    if (isStackingContext(container)) {
                        this.parse(container);
                        this.renderQueue.push(new ClearTransform());
                    }
                }, this);
            };
            NodeParser.prototype.paint = function (container) {
                try {
                    if (container instanceof ClearTransform) {
                        this.renderer.ctx.restore();
                    } else if (isTextNode(container)) {
                        if (isPseudoElement(container.parent)) {
                            container.parent.appendToDOM();
                        }
                        this.paintText(container);
                        if (isPseudoElement(container.parent)) {
                            container.parent.cleanDOM();
                        }
                    } else {
                        this.paintNode(container);
                    }
                } catch (e) {
                    log(e);
                    if (this.options.strict) {
                        throw e;
                    }
                }
            };
            NodeParser.prototype.paintNode = function (container) {
                if (isStackingContext(container)) {
                    this.renderer.setOpacity(container.opacity);
                    this.renderer.ctx.save();
                    if (container.hasTransform()) {
                        this.renderer.setTransform(container.parseTransform());
                    }
                }
                if (container.node.nodeName === "INPUT" && container.node.type === "checkbox") {
                    this.paintCheckbox(container);
                } else if (container.node.nodeName === "INPUT" && container.node.type === "radio") {
                    this.paintRadio(container);
                } else {
                    this.paintElement(container);
                }
            };
            NodeParser.prototype.paintElement = function (container) {
                var bounds = container.parseBounds();
                this.renderer.clip(container.backgroundClip, function () {
                    this.renderer.renderBackground(container, bounds, container.borders.borders.map(getWidth));
                }, this);
                this.renderer.clip(container.clip, function () {
                    this.renderer.renderBorders(container.borders.borders);
                }, this);
                this.renderer.clip(container.backgroundClip, function () {
                    switch (container.node.nodeName) {
                        case "svg":
                        case "IFRAME":
                            var imgContainer = this.images.get(container.node);
                            if (imgContainer) {
                                this.renderer.renderImage(container, bounds, container.borders, imgContainer);
                            } else {
                                log("Error loading <" + container.node.nodeName + ">", container.node);
                            }
                            break;
                        case "IMG":
                            var imageContainer = this.images.get(container.node.src);
                            if (imageContainer) {
                                this.renderer.renderImage(container, bounds, container.borders, imageContainer);
                            } else {
                                log("Error loading <img>", container.node.src);
                            }
                            break;
                        case "CANVAS":
                            this.renderer.renderImage(container, bounds, container.borders, {image: container.node});
                            break;
                        case "SELECT":
                        case "INPUT":
                        case "TEXTAREA":
                            this.paintFormValue(container);
                            break;
                    }
                }, this);
            };
            NodeParser.prototype.paintCheckbox = function (container) {
                var b = container.parseBounds();
                var size = Math.min(b.width, b.height);
                var bounds = {width: size - 1, height: size - 1, top: b.top, left: b.left};
                var r = [3, 3];
                var radius = [r, r, r, r];
                var borders = [1, 1, 1, 1].map(function (w) {
                    return {color: new Color('#A5A5A5'), width: w};
                });
                var borderPoints = calculateCurvePoints(bounds, radius, borders);
                this.renderer.clip(container.backgroundClip, function () {
                    this.renderer.rectangle(bounds.left + 1, bounds.top + 1, bounds.width - 2, bounds.height - 2, new Color("#DEDEDE"));
                    this.renderer.renderBorders(calculateBorders(borders, bounds, borderPoints, radius));
                    if (container.node.checked) {
                        this.renderer.font(new Color('#424242'), 'normal', 'normal', 'bold', (size - 3) + "px", 'arial');
                        this.renderer.text("\u2714", bounds.left + size / 6, bounds.top + size - 1);
                    }
                }, this);
            };
            NodeParser.prototype.paintRadio = function (container) {
                var bounds = container.parseBounds();
                var size = Math.min(bounds.width, bounds.height) - 2;
                this.renderer.clip(container.backgroundClip, function () {
                    this.renderer.circleStroke(bounds.left + 1, bounds.top + 1, size, new Color('#DEDEDE'), 1, new Color('#A5A5A5'));
                    if (container.node.checked) {
                        this.renderer.circle(Math.ceil(bounds.left + size / 4) + 1, Math.ceil(bounds.top + size / 4) + 1, Math.floor(size / 2), new Color('#424242'));
                    }
                }, this);
            };
            NodeParser.prototype.paintFormValue = function (container) {
                var value = container.getValue();
                if (value.length > 0) {
                    var document = container.node.ownerDocument;
                    var wrapper = document.createElement('html2canvaswrapper');
                    var properties = ['lineHeight', 'textAlign', 'fontFamily', 'fontWeight', 'fontSize', 'color',
                        'paddingLeft', 'paddingTop', 'paddingRight', 'paddingBottom',
                        'width', 'height', 'borderLeftStyle', 'borderTopStyle', 'borderLeftWidth', 'borderTopWidth',
                        'boxSizing', 'whiteSpace', 'wordWrap'];
                    properties.forEach(function (property) {
                        try {
                            wrapper.style[property] = container.css(property);
                        } catch (e) {
                            // Older IE has issues with "border"
                            log("html2canvas: Parse: Exception caught in renderFormValue: " + e.message);
                        }
                    });
                    var bounds = container.parseBounds();
                    wrapper.style.position = "fixed";
                    wrapper.style.left = bounds.left + "px";
                    wrapper.style.top = bounds.top + "px";
                    wrapper.textContent = value;
                    document.body.appendChild(wrapper);
                    this.paintText(new TextContainer(wrapper.firstChild, container));
                    document.body.removeChild(wrapper);
                }
            };
            NodeParser.prototype.paintText = function (container) {
                container.applyTextTransform();
                var characters = punycode.ucs2.decode(container.node.data);
                var textList = (!this.options.letterRendering || noLetterSpacing(container)) && !hasUnicode(container.node.data) ? getWords(characters) : characters.map(function (character) {
                    return punycode.ucs2.encode([character]);
                });
                var weight = container.parent.fontWeight();
                var size = container.parent.css('fontSize');
                var family = container.parent.css('fontFamily');
                var shadows = container.parent.parseTextShadows();
                this.renderer.font(container.parent.color('color'), container.parent.css('fontStyle'), container.parent.css('fontVariant'), weight, size, family);
                if (shadows.length) {
                    // TODO: support multiple text shadows
                    this.renderer.fontShadow(shadows[0].color, shadows[0].offsetX, shadows[0].offsetY, shadows[0].blur);
                } else {
                    this.renderer.clearShadow();
                }
                this.renderer.clip(container.parent.clip, function () {
                    textList.map(this.parseTextBounds(container), this).forEach(function (bounds, index) {
                        if (bounds) {
                            this.renderer.text(textList[index], bounds.left, bounds.bottom);
                            this.renderTextDecoration(container.parent, bounds, this.fontMetrics.getMetrics(family, size));
                        }
                    }, this);
                }, this);
            };
            NodeParser.prototype.renderTextDecoration = function (container, bounds, metrics) {
                switch (container.css("textDecoration").split(" ")[0]) {
                    case "underline":
                        // Draws a line at the baseline of the font
                        // TODO As some browsers display the line as more than 1px if the font-size is big, need to take that into account both in position and size
                        this.renderer.rectangle(bounds.left, Math.round(bounds.top + metrics.baseline + metrics.lineWidth), bounds.width, 1, container.color("color"));
                        break;
                    case "overline":
                        this.renderer.rectangle(bounds.left, Math.round(bounds.top), bounds.width, 1, container.color("color"));
                        break;
                    case "line-through":
                        // TODO try and find exact position for line-through
                        this.renderer.rectangle(bounds.left, Math.ceil(bounds.top + metrics.middle + metrics.lineWidth), bounds.width, 1, container.color("color"));
                        break;
                }
            };
            var borderColorTransforms = {
                inset: [
                    ["darken", 0.60],
                    ["darken", 0.10],
                    ["darken", 0.10],
                    ["darken", 0.60]
                ]
            };
            NodeParser.prototype.parseBorders = function (container) {
                var nodeBounds = container.parseBounds();
                var radius = getBorderRadiusData(container);
                var borders = ["Top", "Right", "Bottom", "Left"].map(function (side, index) {
                    var style = container.css('border' + side + 'Style');
                    var color = container.color('border' + side + 'Color');
                    if (style === "inset" && color.isBlack()) {
                        color = new Color([255, 255, 255, color.a]); // this is wrong, but
                    }
                    var colorTransform = borderColorTransforms[style] ? borderColorTransforms[style][index] : null;
                    return {
                        width: container.cssInt('border' + side + 'Width'),
                        color: colorTransform ? color[colorTransform[0]](colorTransform[1]) : color,
                        args: null
                    };
                });
                var borderPoints = calculateCurvePoints(nodeBounds, radius, borders);
                return {
                    clip: this.parseBackgroundClip(container, borderPoints, borders, radius, nodeBounds),
                    borders: calculateBorders(borders, nodeBounds, borderPoints, radius)
                };
            };
            
            function calculateBorders(borders, nodeBounds, borderPoints, radius) {
                return borders.map(function (border, borderSide) {
                    if (border.width > 0) {
                        var bx = nodeBounds.left;
                        var by = nodeBounds.top;
                        var bw = nodeBounds.width;
                        var bh = nodeBounds.height - (borders[2].width);
                        switch (borderSide) {
                            case 0:
                                // top border
                                bh = borders[0].width;
                                border.args = drawSide({
                                        c1: [bx, by],
                                        c2: [bx + bw, by],
                                        c3: [bx + bw - borders[1].width, by + bh],
                                        c4: [bx + borders[3].width, by + bh]
                                    }, radius[0], radius[1],
                                    borderPoints.topLeftOuter, borderPoints.topLeftInner, borderPoints.topRightOuter, borderPoints.topRightInner);
                                break;
                            case 1:
                                // right border
                                bx = nodeBounds.left + nodeBounds.width - (borders[1].width);
                                bw = borders[1].width;
                                border.args = drawSide({
                                        c1: [bx + bw, by],
                                        c2: [bx + bw, by + bh + borders[2].width],
                                        c3: [bx, by + bh],
                                        c4: [bx, by + borders[0].width]
                                    }, radius[1], radius[2],
                                    borderPoints.topRightOuter, borderPoints.topRightInner, borderPoints.bottomRightOuter, borderPoints.bottomRightInner);
                                break;
                            case 2:
                                // bottom border
                                by = (by + nodeBounds.height) - (borders[2].width);
                                bh = borders[2].width;
                                border.args = drawSide({
                                        c1: [bx + bw, by + bh],
                                        c2: [bx, by + bh],
                                        c3: [bx + borders[3].width, by],
                                        c4: [bx + bw - borders[3].width, by]
                                    }, radius[2], radius[3],
                                    borderPoints.bottomRightOuter, borderPoints.bottomRightInner, borderPoints.bottomLeftOuter, borderPoints.bottomLeftInner);
                                break;
                            case 3:
                                // left border
                                bw = borders[3].width;
                                border.args = drawSide({
                                        c1: [bx, by + bh + borders[2].width],
                                        c2: [bx, by],
                                        c3: [bx + bw, by + borders[0].width],
                                        c4: [bx + bw, by + bh]
                                    }, radius[3], radius[0],
                                    borderPoints.bottomLeftOuter, borderPoints.bottomLeftInner, borderPoints.topLeftOuter, borderPoints.topLeftInner);
                                break;
                        }
                    }
                    return border;
                });
            }
            
            NodeParser.prototype.parseBackgroundClip = function (container, borderPoints, borders, radius, bounds) {
                var backgroundClip = container.css('backgroundClip'),
                    borderArgs = [];
                switch (backgroundClip) {
                    case "content-box":
                    case "padding-box":
                        parseCorner(borderArgs, radius[0], radius[1], borderPoints.topLeftInner, borderPoints.topRightInner, bounds.left + borders[3].width, bounds.top + borders[0].width);
                        parseCorner(borderArgs, radius[1], radius[2], borderPoints.topRightInner, borderPoints.bottomRightInner, bounds.left + bounds.width - borders[1].width, bounds.top + borders[0].width);
                        parseCorner(borderArgs, radius[2], radius[3], borderPoints.bottomRightInner, borderPoints.bottomLeftInner, bounds.left + bounds.width - borders[1].width, bounds.top + bounds.height - borders[2].width);
                        parseCorner(borderArgs, radius[3], radius[0], borderPoints.bottomLeftInner, borderPoints.topLeftInner, bounds.left + borders[3].width, bounds.top + bounds.height - borders[2].width);
                        break;
                    default:
                        parseCorner(borderArgs, radius[0], radius[1], borderPoints.topLeftOuter, borderPoints.topRightOuter, bounds.left, bounds.top);
                        parseCorner(borderArgs, radius[1], radius[2], borderPoints.topRightOuter, borderPoints.bottomRightOuter, bounds.left + bounds.width, bounds.top);
                        parseCorner(borderArgs, radius[2], radius[3], borderPoints.bottomRightOuter, borderPoints.bottomLeftOuter, bounds.left + bounds.width, bounds.top + bounds.height);
                        parseCorner(borderArgs, radius[3], radius[0], borderPoints.bottomLeftOuter, borderPoints.topLeftOuter, bounds.left, bounds.top + bounds.height);
                        break;
                }
                return borderArgs;
            };
            
            function getCurvePoints(x, y, r1, r2) {
                var kappa = 4 * ((Math.sqrt(2) - 1) / 3);
                var ox = (r1) * kappa, // control point offset horizontal
                    oy = (r2) * kappa, // control point offset vertical
                    xm = x + r1, // x-middle
                    ym = y + r2; // y-middle
                return {
                    topLeft: bezierCurve({x: x, y: ym}, {x: x, y: ym - oy}, {x: xm - ox, y: y}, {x: xm, y: y}),
                    topRight: bezierCurve({x: x, y: y}, {x: x + ox, y: y}, {x: xm, y: ym - oy}, {x: xm, y: ym}),
                    bottomRight: bezierCurve({x: xm, y: y}, {x: xm, y: y + oy}, {x: x + ox, y: ym}, {x: x, y: ym}),
                    bottomLeft: bezierCurve({x: xm, y: ym}, {x: xm - ox, y: ym}, {x: x, y: y + oy}, {x: x, y: y})
                };
            }
            
            function calculateCurvePoints(bounds, borderRadius, borders) {
                var x = bounds.left,
                    y = bounds.top,
                    width = bounds.width,
                    height = bounds.height,
                    tlh = borderRadius[0][0] < width / 2 ? borderRadius[0][0] : width / 2,
                    tlv = borderRadius[0][1] < height / 2 ? borderRadius[0][1] : height / 2,
                    trh = borderRadius[1][0] < width / 2 ? borderRadius[1][0] : width / 2,
                    trv = borderRadius[1][1] < height / 2 ? borderRadius[1][1] : height / 2,
                    brh = borderRadius[2][0] < width / 2 ? borderRadius[2][0] : width / 2,
                    brv = borderRadius[2][1] < height / 2 ? borderRadius[2][1] : height / 2,
                    blh = borderRadius[3][0] < width / 2 ? borderRadius[3][0] : width / 2,
                    blv = borderRadius[3][1] < height / 2 ? borderRadius[3][1] : height / 2;
                var topWidth = width - trh,
                    rightHeight = height - brv,
                    bottomWidth = width - brh,
                    leftHeight = height - blv;
                return {
                    topLeftOuter: getCurvePoints(x, y, tlh, tlv).topLeft.subdivide(0.5),
                    topLeftInner: getCurvePoints(x + borders[3].width, y + borders[0].width, Math.max(0, tlh - borders[3].width), Math.max(0, tlv - borders[0].width)).topLeft.subdivide(0.5),
                    topRightOuter: getCurvePoints(x + topWidth, y, trh, trv).topRight.subdivide(0.5),
                    topRightInner: getCurvePoints(x + Math.min(topWidth, width + borders[3].width), y + borders[0].width, (topWidth > width + borders[3].width) ? 0 : trh - borders[3].width, trv - borders[0].width).topRight.subdivide(0.5),
                    bottomRightOuter: getCurvePoints(x + bottomWidth, y + rightHeight, brh, brv).bottomRight.subdivide(0.5),
                    bottomRightInner: getCurvePoints(x + Math.min(bottomWidth, width - borders[3].width), y + Math.min(rightHeight, height + borders[0].width), Math.max(0, brh - borders[1].width), brv - borders[2].width).bottomRight.subdivide(0.5),
                    bottomLeftOuter: getCurvePoints(x, y + leftHeight, blh, blv).bottomLeft.subdivide(0.5),
                    bottomLeftInner: getCurvePoints(x + borders[3].width, y + leftHeight, Math.max(0, blh - borders[3].width), blv - borders[2].width).bottomLeft.subdivide(0.5)
                };
            }
            
            function bezierCurve(start, startControl, endControl, end) {
                var lerp = function (a, b, t) {
                    return {
                        x: a.x + (b.x - a.x) * t,
                        y: a.y + (b.y - a.y) * t
                    };
                };
                return {
                    start: start,
                    startControl: startControl,
                    endControl: endControl,
                    end: end,
                    subdivide: function (t) {
                        var ab = lerp(start, startControl, t),
                            bc = lerp(startControl, endControl, t),
                            cd = lerp(endControl, end, t),
                            abbc = lerp(ab, bc, t),
                            bccd = lerp(bc, cd, t),
                            dest = lerp(abbc, bccd, t);
                        return [bezierCurve(start, ab, abbc, dest), bezierCurve(dest, bccd, cd, end)];
                    },
                    curveTo: function (borderArgs) {
                        borderArgs.push(["bezierCurve", startControl.x, startControl.y, endControl.x, endControl.y, end.x, end.y]);
                    },
                    curveToReversed: function (borderArgs) {
                        borderArgs.push(["bezierCurve", endControl.x, endControl.y, startControl.x, startControl.y, start.x, start.y]);
                    }
                };
            }
            
            function drawSide(borderData, radius1, radius2, outer1, inner1, outer2, inner2) {
                var borderArgs = [];
                if (radius1[0] > 0 || radius1[1] > 0) {
                    borderArgs.push(["line", outer1[1].start.x, outer1[1].start.y]);
                    outer1[1].curveTo(borderArgs);
                } else {
                    borderArgs.push(["line", borderData.c1[0], borderData.c1[1]]);
                }
                if (radius2[0] > 0 || radius2[1] > 0) {
                    borderArgs.push(["line", outer2[0].start.x, outer2[0].start.y]);
                    outer2[0].curveTo(borderArgs);
                    borderArgs.push(["line", inner2[0].end.x, inner2[0].end.y]);
                    inner2[0].curveToReversed(borderArgs);
                } else {
                    borderArgs.push(["line", borderData.c2[0], borderData.c2[1]]);
                    borderArgs.push(["line", borderData.c3[0], borderData.c3[1]]);
                }
                if (radius1[0] > 0 || radius1[1] > 0) {
                    borderArgs.push(["line", inner1[1].end.x, inner1[1].end.y]);
                    inner1[1].curveToReversed(borderArgs);
                } else {
                    borderArgs.push(["line", borderData.c4[0], borderData.c4[1]]);
                }
                return borderArgs;
            }
            
            function parseCorner(borderArgs, radius1, radius2, corner1, corner2, x, y) {
                if (radius1[0] > 0 || radius1[1] > 0) {
                    borderArgs.push(["line", corner1[0].start.x, corner1[0].start.y]);
                    corner1[0].curveTo(borderArgs);
                    corner1[1].curveTo(borderArgs);
                } else {
                    borderArgs.push(["line", x, y]);
                }
                if (radius2[0] > 0 || radius2[1] > 0) {
                    borderArgs.push(["line", corner2[0].start.x, corner2[0].start.y]);
                }
            }
            
            function negativeZIndex(container) {
                return container.cssInt("zIndex") < 0;
            }
            
            function positiveZIndex(container) {
                return container.cssInt("zIndex") > 0;
            }
            
            function zIndex0(container) {
                return container.cssInt("zIndex") === 0;
            }
            
            function inlineLevel(container) {
                return ["inline", "inline-block", "inline-table"].indexOf(container.css("display")) !== -1;
            }
            
            function isStackingContext(container) {
                return (container instanceof StackingContext);
            }
            
            function hasText(container) {
                return container.node.data.trim().length > 0;
            }
            
            function noLetterSpacing(container) {
                return (/^(normal|none|0px)$/.test(container.parent.css("letterSpacing")));
            }
            
            function getBorderRadiusData(container) {
                return ["TopLeft", "TopRight", "BottomRight", "BottomLeft"].map(function (side) {
                    var value = container.css('border' + side + 'Radius');
                    var arr = value.split(" ");
                    if (arr.length <= 1) {
                        arr[1] = arr[0];
                    }
                    return arr.map(asInt);
                });
            }
            
            function renderableNode(node) {
                return (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE);
            }
            
            function isPositionedForStacking(container) {
                var position = container.css("position");
                var zIndex = (["absolute", "relative", "fixed"].indexOf(position) !== -1) ? container.css("zIndex") : "auto";
                return zIndex !== "auto";
            }
            
            function isPositioned(container) {
                return container.css("position") !== "static";
            }
            
            function isFloating(container) {
                return container.css("float") !== "none";
            }
            
            function isInlineBlock(container) {
                return ["inline-block", "inline-table"].indexOf(container.css("display")) !== -1;
            }
            
            function not(callback) {
                var context = this;
                return function () {
                    return !callback.apply(context, arguments);
                };
            }
            
            function isElement(container) {
                return container.node.nodeType === Node.ELEMENT_NODE;
            }
            
            function isPseudoElement(container) {
                return container.isPseudoElement === true;
            }
            
            function isTextNode(container) {
                return container.node.nodeType === Node.TEXT_NODE;
            }
            
            function zIndexSort(contexts) {
                return function (a, b) {
                    return (a.cssInt("zIndex") + (contexts.indexOf(a) / contexts.length)) - (b.cssInt("zIndex") + (contexts.indexOf(b) / contexts.length));
                };
            }
            
            function hasOpacity(container) {
                return container.getOpacity() < 1;
            }
            
            function asInt(value) {
                return parseInt(value, 10);
            }
            
            function getWidth(border) {
                return border.width;
            }
            
            function nonIgnoredElement(nodeContainer) {
                return (nodeContainer.node.nodeType !== Node.ELEMENT_NODE || ["SCRIPT", "HEAD", "TITLE", "OBJECT", "BR", "OPTION"].indexOf(nodeContainer.node.nodeName) === -1);
            }
            
            function flatten(arrays) {
                return [].concat.apply([], arrays);
            }
            
            function stripQuotes(content) {
                var first = content.substr(0, 1);
                return (first === content.substr(content.length - 1) && first.match(/'|"/)) ? content.substr(1, content.length - 2) : content;
            }
            
            function getWords(characters) {
                var words = [], i = 0, onWordBoundary = false, word;
                while (characters.length) {
                    if (isWordBoundary(characters[i]) === onWordBoundary) {
                        word = characters.splice(0, i);
                        if (word.length) {
                            words.push(punycode.ucs2.encode(word));
                        }
                        onWordBoundary = !onWordBoundary;
                        i = 0;
                    } else {
                        i++;
                    }
                    if (i >= characters.length) {
                        word = characters.splice(0, i);
                        if (word.length) {
                            words.push(punycode.ucs2.encode(word));
                        }
                    }
                }
                return words;
            }
            
            function isWordBoundary(characterCode) {
                return [
                    32, // <space>
                    13, // \r
                    10, // \n
                    9, // \t
                    45 // -
                ].indexOf(characterCode) !== -1;
            }
            
            function hasUnicode(string) {
                return (/[^\u0000-\u00ff]/).test(string);
            }
            
            module.exports = NodeParser;
        }, {
            "./color": 3, "./fontmetrics": 7, "./log": 13, "./nodecontainer": 14, "./pseudoelementcontainer": 18,
            "./stackingcontext": 21, "./textcontainer": 25, "./utils": 26, "punycode": 1
        }], 16: [function (_dereq_, module, exports) {
            var XHR = _dereq_('./xhr');
            var utils = _dereq_('./utils');
            var log = _dereq_('./log');
            var createWindowClone = _dereq_('./clone');
            var decode64 = utils.decode64;
            
            function Proxy(src, proxyUrl, document) {
                var supportsCORS = ('withCredentials' in new XMLHttpRequest());
                if (!proxyUrl) {
                    return Promise.reject("No proxy configured");
                }
                var callback = createCallback(supportsCORS);
                var url = createProxyUrl(proxyUrl, src, callback);
                return supportsCORS ? XHR(url) : (jsonp(document, url, callback).then(function (response) {
                    return decode64(response.content);
                }));
            }
            
            var proxyCount = 0;
            
            function ProxyURL(src, proxyUrl, document) {
                var supportsCORSImage = ('crossOrigin' in new Image());
                var callback = createCallback(supportsCORSImage);
                var url = createProxyUrl(proxyUrl, src, callback);
                return (supportsCORSImage ? Promise.resolve(url) : jsonp(document, url, callback).then(function (response) {
                    return "data:" + response.type + ";base64," + response.content;
                }));
            }
            
            function jsonp(document, url, callback) {
                return new Promise(function (resolve, reject) {
                    var s = document.createElement("script");
                    var cleanup = function () {
                        delete window.html2canvas.proxy[callback];
                        document.body.removeChild(s);
                    };
                    window.html2canvas.proxy[callback] = function (response) {
                        cleanup();
                        resolve(response);
                    };
                    s.src = url;
                    s.onerror = function (e) {
                        cleanup();
                        reject(e);
                    };
                    document.body.appendChild(s);
                });
            }
            
            function createCallback(useCORS) {
                return !useCORS ? "html2canvas_" + Date.now() + "_" + (++proxyCount) + "_" + Math.round(Math.random() * 100000) : "";
            }
            
            function createProxyUrl(proxyUrl, src, callback) {
                return proxyUrl + "?url=" + encodeURIComponent(src) + (callback.length ? "&callback=html2canvas.proxy." + callback : "");
            }
            
            function documentFromHTML(src) {
                return function (html) {
                    var parser = new DOMParser(), doc;
                    try {
                        doc = parser.parseFromString(html, "text/html");
                    } catch (e) {
                        log("DOMParser not supported, falling back to createHTMLDocument");
                        doc = document.implementation.createHTMLDocument("");
                        try {
                            doc.open();
                            doc.write(html);
                            doc.close();
                        } catch (ee) {
                            log("createHTMLDocument write not supported, falling back to document.body.innerHTML");
                            doc.body.innerHTML = html; // ie9 doesnt support writing to documentElement
                        }
                    }
                    var b = doc.querySelector("base");
                    if (!b || !b.href.host) {
                        var base = doc.createElement("base");
                        base.href = src;
                        doc.head.insertBefore(base, doc.head.firstChild);
                    }
                    return doc;
                };
            }
            
            function loadUrlDocument(src, proxy, document, width, height, options) {
                return new Proxy(src, proxy, window.document).then(documentFromHTML(src)).then(function (doc) {
                    return createWindowClone(doc, document, width, height, options, 0, 0);
                });
            }
            
            exports.Proxy = Proxy;
            exports.ProxyURL = ProxyURL;
            exports.loadUrlDocument = loadUrlDocument;
        }, {"./clone": 2, "./log": 13, "./utils": 26, "./xhr": 28}], 17: [function (_dereq_, module, exports) {
            var ProxyURL = _dereq_('./proxy').ProxyURL;
            
            function ProxyImageContainer(src, proxy) {
                var link = document.createElement("a");
                link.href = src;
                src = link.href;
                this.src = src;
                this.image = new Image();
                var self = this;
                this.promise = new Promise(function (resolve, reject) {
                    self.image.crossOrigin = "Anonymous";
                    self.image.onload = resolve;
                    self.image.onerror = reject;
                    new ProxyURL(src, proxy, document).then(function (url) {
                        self.image.src = url;
                    })['catch'](reject);
                });
            }
            
            module.exports = ProxyImageContainer;
        }, {"./proxy": 16}], 18: [function (_dereq_, module, exports) {
            var NodeContainer = _dereq_('./nodecontainer');
            
            function PseudoElementContainer(node, parent, type) {
                NodeContainer.call(this, node, parent);
                this.isPseudoElement = true;
                this.before = type === ":before";
            }
            
            PseudoElementContainer.prototype.cloneTo = function (stack) {
                PseudoElementContainer.prototype.cloneTo.call(this, stack);
                stack.isPseudoElement = true;
                stack.before = this.before;
            };
            PseudoElementContainer.prototype = Object.create(NodeContainer.prototype);
            PseudoElementContainer.prototype.appendToDOM = function () {
                if (this.before) {
                    this.parent.node.insertBefore(this.node, this.parent.node.firstChild);
                } else {
                    this.parent.node.appendChild(this.node);
                }
                this.parent.node.className += " " + this.getHideClass();
            };
            PseudoElementContainer.prototype.cleanDOM = function () {
                this.node.parentNode.removeChild(this.node);
                this.parent.node.className = this.parent.node.className.replace(this.getHideClass(), "");
            };
            PseudoElementContainer.prototype.getHideClass = function () {
                return this["PSEUDO_HIDE_ELEMENT_CLASS_" + (this.before ? "BEFORE" : "AFTER")];
            };
            PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE = "___html2canvas___pseudoelement_before";
            PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER = "___html2canvas___pseudoelement_after";
            module.exports = PseudoElementContainer;
        }, {"./nodecontainer": 14}], 19: [function (_dereq_, module, exports) {
            var log = _dereq_('./log');
            
            function Renderer(width, height, images, options, document) {
                this.width = width;
                this.height = height;
                this.images = images;
                this.options = options;
                this.document = document;
            }
            
            Renderer.prototype.renderImage = function (container, bounds, borderData, imageContainer) {
                var paddingLeft = container.cssInt('paddingLeft'),
                    paddingTop = container.cssInt('paddingTop'),
                    paddingRight = container.cssInt('paddingRight'),
                    paddingBottom = container.cssInt('paddingBottom'),
                    borders = borderData.borders;
                var width = bounds.width - (borders[1].width + borders[3].width + paddingLeft + paddingRight);
                var height = bounds.height - (borders[0].width + borders[2].width + paddingTop + paddingBottom);
                this.drawImage(
                    imageContainer,
                    0,
                    0,
                    imageContainer.image.width || width,
                    imageContainer.image.height || height,
                    bounds.left + paddingLeft + borders[3].width,
                    bounds.top + paddingTop + borders[0].width,
                    width,
                    height
                );
            };
            Renderer.prototype.renderBackground = function (container, bounds, borderData) {
                if (bounds.height > 0 && bounds.width > 0) {
                    this.renderBackgroundColor(container, bounds);
                    this.renderBackgroundImage(container, bounds, borderData);
                }
            };
            Renderer.prototype.renderBackgroundColor = function (container, bounds) {
                var color = container.color("backgroundColor");
                if (!color.isTransparent()) {
                    this.rectangle(bounds.left, bounds.top, bounds.width, bounds.height, color);
                }
            };
            Renderer.prototype.renderBorders = function (borders) {
                borders.forEach(this.renderBorder, this);
            };
            Renderer.prototype.renderBorder = function (data) {
                if (!data.color.isTransparent() && data.args !== null) {
                    this.drawShape(data.args, data.color);
                }
            };
            Renderer.prototype.renderBackgroundImage = function (container, bounds, borderData) {
                var backgroundImages = container.parseBackgroundImages();
                backgroundImages.reverse().forEach(function (backgroundImage, index, arr) {
                    switch (backgroundImage.method) {
                        case "url":
                            var image = this.images.get(backgroundImage.args[0]);
                            if (image) {
                                this.renderBackgroundRepeating(container, bounds, image, arr.length - (index + 1), borderData);
                            } else {
                                log("Error loading background-image", backgroundImage.args[0]);
                            }
                            break;
                        case "linear-gradient":
                        case "gradient":
                            var gradientImage = this.images.get(backgroundImage.value);
                            if (gradientImage) {
                                this.renderBackgroundGradient(gradientImage, bounds, borderData);
                            } else {
                                log("Error loading background-image", backgroundImage.args[0]);
                            }
                            break;
                        case "none":
                            break;
                        default:
                            log("Unknown background-image type", backgroundImage.args[0]);
                    }
                }, this);
            };
            Renderer.prototype.renderBackgroundRepeating = function (container, bounds, imageContainer, index, borderData) {
                var size = container.parseBackgroundSize(bounds, imageContainer.image, index);
                var position = container.parseBackgroundPosition(bounds, imageContainer.image, index, size);
                var repeat = container.parseBackgroundRepeat(index);
                switch (repeat) {
                    case "repeat-x":
                    case "repeat no-repeat":
                        this.backgroundRepeatShape(imageContainer, position, size, bounds, bounds.left + borderData[3], bounds.top + position.top + borderData[0], 99999, size.height, borderData);
                        break;
                    case "repeat-y":
                    case "no-repeat repeat":
                        this.backgroundRepeatShape(imageContainer, position, size, bounds, bounds.left + position.left + borderData[3], bounds.top + borderData[0], size.width, 99999, borderData);
                        break;
                    case "no-repeat":
                        this.backgroundRepeatShape(imageContainer, position, size, bounds, bounds.left + position.left + borderData[3], bounds.top + position.top + borderData[0], size.width, size.height, borderData);
                        break;
                    default:
                        this.renderBackgroundRepeat(imageContainer, position, size, {
                            top: bounds.top, left: bounds.left
                        }, borderData[3], borderData[0]);
                        break;
                }
            };
            module.exports = Renderer;
        }, {"./log": 13}], 20: [function (_dereq_, module, exports) {
            var Renderer = _dereq_('../renderer');
            var LinearGradientContainer = _dereq_('../lineargradientcontainer');
            var log = _dereq_('../log');
            
            function CanvasRenderer(width, height) {
                Renderer.apply(this, arguments);
                this.canvas = this.options.canvas || this.document.createElement("canvas");
                if (!this.options.canvas) {
                    this.canvas.width = width;
                    this.canvas.height = height;
                }
                this.ctx = this.canvas.getContext("2d");
                this.taintCtx = this.document.createElement("canvas").getContext("2d");
                this.ctx.textBaseline = "bottom";
                this.variables = {};
                log("Initialized CanvasRenderer with size", width, "x", height);
            }
            
            CanvasRenderer.prototype = Object.create(Renderer.prototype);
            CanvasRenderer.prototype.setFillStyle = function (fillStyle) {
                this.ctx.fillStyle = typeof(fillStyle) === "object" && !!fillStyle.isColor ? fillStyle.toString() : fillStyle;
                return this.ctx;
            };
            CanvasRenderer.prototype.rectangle = function (left, top, width, height, color) {
                this.setFillStyle(color).fillRect(left, top, width, height);
            };
            CanvasRenderer.prototype.circle = function (left, top, size, color) {
                this.setFillStyle(color);
                this.ctx.beginPath();
                this.ctx.arc(left + size / 2, top + size / 2, size / 2, 0, Math.PI * 2, true);
                this.ctx.closePath();
                this.ctx.fill();
            };
            CanvasRenderer.prototype.circleStroke = function (left, top, size, color, stroke, strokeColor) {
                this.circle(left, top, size, color);
                this.ctx.strokeStyle = strokeColor.toString();
                this.ctx.stroke();
            };
            CanvasRenderer.prototype.drawShape = function (shape, color) {
                this.shape(shape);
                this.setFillStyle(color).fill();
            };
            CanvasRenderer.prototype.taints = function (imageContainer) {
                if (imageContainer.tainted === null) {
                    this.taintCtx.drawImage(imageContainer.image, 0, 0);
                    try {
                        this.taintCtx.getImageData(0, 0, 1, 1);
                        imageContainer.tainted = false;
                    } catch (e) {
                        this.taintCtx = document.createElement("canvas").getContext("2d");
                        imageContainer.tainted = true;
                    }
                }
                return imageContainer.tainted;
            };
            CanvasRenderer.prototype.drawImage = function (imageContainer, sx, sy, sw, sh, dx, dy, dw, dh) {
                if (!this.taints(imageContainer) || this.options.allowTaint) {
                    this.ctx.drawImage(imageContainer.image, sx, sy, sw, sh, dx, dy, dw, dh);
                }
            };
            CanvasRenderer.prototype.clip = function (shapes, callback, context) {
                this.ctx.save();
                shapes.filter(hasEntries).forEach(function (shape) {
                    this.shape(shape).clip();
                }, this);
                callback.call(context);
                this.ctx.restore();
            };
            CanvasRenderer.prototype.shape = function (shape) {
                this.ctx.beginPath();
                shape.forEach(function (point, index) {
                    if (point[0] === "rect") {
                        this.ctx.rect.apply(this.ctx, point.slice(1));
                    } else {
                        this.ctx[(index === 0) ? "moveTo" : point[0] + "To"].apply(this.ctx, point.slice(1));
                    }
                }, this);
                this.ctx.closePath();
                return this.ctx;
            };
            CanvasRenderer.prototype.font = function (color, style, variant, weight, size, family) {
                this.setFillStyle(color).font = [style, variant, weight, size, family].join(" ").split(",")[0];
            };
            CanvasRenderer.prototype.fontShadow = function (color, offsetX, offsetY, blur) {
                this.setVariable("shadowColor", color.toString())
                    .setVariable("shadowOffsetY", offsetX)
                    .setVariable("shadowOffsetX", offsetY)
                    .setVariable("shadowBlur", blur);
            };
            CanvasRenderer.prototype.clearShadow = function () {
                this.setVariable("shadowColor", "rgba(0,0,0,0)");
            };
            CanvasRenderer.prototype.setOpacity = function (opacity) {
                this.ctx.globalAlpha = opacity;
            };
            CanvasRenderer.prototype.setTransform = function (transform) {
                this.ctx.translate(transform.origin[0], transform.origin[1]);
                this.ctx.transform.apply(this.ctx, transform.matrix);
                this.ctx.translate(-transform.origin[0], -transform.origin[1]);
            };
            CanvasRenderer.prototype.setVariable = function (property, value) {
                if (this.variables[property] !== value) {
                    this.variables[property] = this.ctx[property] = value;
                }
                return this;
            };
            CanvasRenderer.prototype.text = function (text, left, bottom) {
                this.ctx.fillText(text, left, bottom);
            };
            CanvasRenderer.prototype.backgroundRepeatShape = function (imageContainer, backgroundPosition, size, bounds, left, top, width, height, borderData) {
                var shape = [
                    ["line", Math.round(left), Math.round(top)],
                    ["line", Math.round(left + width), Math.round(top)],
                    ["line", Math.round(left + width), Math.round(height + top)],
                    ["line", Math.round(left), Math.round(height + top)]
                ];
                this.clip([shape], function () {
                    this.renderBackgroundRepeat(imageContainer, backgroundPosition, size, bounds, borderData[3], borderData[0]);
                }, this);
            };
            CanvasRenderer.prototype.renderBackgroundRepeat = function (imageContainer, backgroundPosition, size, bounds, borderLeft, borderTop) {
                var offsetX = Math.round(bounds.left + backgroundPosition.left + borderLeft),
                    offsetY = Math.round(bounds.top + backgroundPosition.top + borderTop);
                this.setFillStyle(this.ctx.createPattern(this.resizeImage(imageContainer, size), "repeat"));
                this.ctx.translate(offsetX, offsetY);
                this.ctx.fill();
                this.ctx.translate(-offsetX, -offsetY);
            };
            CanvasRenderer.prototype.renderBackgroundGradient = function (gradientImage, bounds) {
                if (gradientImage instanceof LinearGradientContainer) {
                    var gradient = this.ctx.createLinearGradient(
                        bounds.left + bounds.width * gradientImage.x0,
                        bounds.top + bounds.height * gradientImage.y0,
                        bounds.left + bounds.width * gradientImage.x1,
                        bounds.top + bounds.height * gradientImage.y1);
                    gradientImage.colorStops.forEach(function (colorStop) {
                        gradient.addColorStop(colorStop.stop, colorStop.color.toString());
                    });
                    this.rectangle(bounds.left, bounds.top, bounds.width, bounds.height, gradient);
                }
            };
            CanvasRenderer.prototype.resizeImage = function (imageContainer, size) {
                var image = imageContainer.image;
                if (image.width === size.width && image.height === size.height) {
                    return image;
                }
                var ctx, canvas = document.createElement('canvas');
                canvas.width = size.width;
                canvas.height = size.height;
                ctx = canvas.getContext("2d");
                ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, size.width, size.height);
                return canvas;
            };
            
            function hasEntries(array) {
                return array.length > 0;
            }
            
            module.exports = CanvasRenderer;
        }, {"../lineargradientcontainer": 12, "../log": 13, "../renderer": 19}],
        21: [function (_dereq_, module, exports) {
            var NodeContainer = _dereq_('./nodecontainer');
            
            function StackingContext(hasOwnStacking, opacity, element, parent) {
                NodeContainer.call(this, element, parent);
                this.ownStacking = hasOwnStacking;
                this.contexts = [];
                this.children = [];
                this.opacity = (this.parent ? this.parent.stack.opacity : 1) * opacity;
            }
            
            StackingContext.prototype = Object.create(NodeContainer.prototype);
            StackingContext.prototype.getParentStack = function (context) {
                var parentStack = (this.parent) ? this.parent.stack : null;
                return parentStack ? (parentStack.ownStacking ? parentStack : parentStack.getParentStack(context)) : context.stack;
            };
            module.exports = StackingContext;
        }, {"./nodecontainer": 14}], 22: [function (_dereq_, module, exports) {
            function Support(document) {
                this.rangeBounds = this.testRangeBounds(document);
                this.cors = this.testCORS();
                this.svg = this.testSVG();
            }
            
            Support.prototype.testRangeBounds = function (document) {
                var range, testElement, rangeBounds, rangeHeight, support = false;
                if (document.createRange) {
                    range = document.createRange();
                    if (range.getBoundingClientRect) {
                        testElement = document.createElement('boundtest');
                        testElement.style.height = "123px";
                        testElement.style.display = "block";
                        document.body.appendChild(testElement);
                        range.selectNode(testElement);
                        rangeBounds = range.getBoundingClientRect();
                        rangeHeight = rangeBounds.height;
                        if (rangeHeight === 123) {
                            support = true;
                        }
                        document.body.removeChild(testElement);
                    }
                }
                return support;
            };
            Support.prototype.testCORS = function () {
                return typeof((new Image()).crossOrigin) !== "undefined";
            };
            Support.prototype.testSVG = function () {
                var img = new Image();
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                img.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";
                try {
                    ctx.drawImage(img, 0, 0);
                    canvas.toDataURL();
                } catch (e) {
                    return false;
                }
                return true;
            };
            module.exports = Support;
        }, {}], 23: [function (_dereq_, module, exports) {
            var XHR = _dereq_('./xhr');
            var decode64 = _dereq_('./utils').decode64;
            
            function SVGContainer(src) {
                this.src = src;
                this.image = null;
                var self = this;
                this.promise = this.hasFabric().then(function () {
                    return (self.isInline(src) ? Promise.resolve(self.inlineFormatting(src)) : XHR(src));
                }).then(function (svg) {
                    return new Promise(function (resolve) {
                        window.html2canvas.svg.fabric.loadSVGFromString(svg, self.createCanvas.call(self, resolve));
                    });
                });
            }
            
            SVGContainer.prototype.hasFabric = function () {
                return !window.html2canvas.svg || !window.html2canvas.svg.fabric ? Promise.reject(new Error("html2canvas.svg.js is not loaded, cannot render svg")) : Promise.resolve();
            };
            SVGContainer.prototype.inlineFormatting = function (src) {
                return (/^data:image\/svg\+xml;base64,/.test(src)) ? this.decode64(this.removeContentType(src)) : this.removeContentType(src);
            };
            SVGContainer.prototype.removeContentType = function (src) {
                return src.replace(/^data:image\/svg\+xml(;base64)?,/, '');
            };
            SVGContainer.prototype.isInline = function (src) {
                return (/^data:image\/svg\+xml/i.test(src));
            };
            SVGContainer.prototype.createCanvas = function (resolve) {
                var self = this;
                return function (objects, options) {
                    var canvas = new window.html2canvas.svg.fabric.StaticCanvas('c');
                    self.image = canvas.lowerCanvasEl;
                    canvas
                        .setWidth(options.width)
                        .setHeight(options.height)
                        .add(window.html2canvas.svg.fabric.util.groupSVGElements(objects, options))
                        .renderAll();
                    resolve(canvas.lowerCanvasEl);
                };
            };
            SVGContainer.prototype.decode64 = function (str) {
                return (typeof(window.atob) === "function") ? window.atob(str) : decode64(str);
            };
            module.exports = SVGContainer;
        }, {"./utils": 26, "./xhr": 28}], 24: [function (_dereq_, module, exports) {
            var SVGContainer = _dereq_('./svgcontainer');
            
            function SVGNodeContainer(node, _native) {
                this.src = node;
                this.image = null;
                var self = this;
                this.promise = _native ? new Promise(function (resolve, reject) {
                    self.image = new Image();
                    self.image.onload = resolve;
                    self.image.onerror = reject;
                    self.image.src = "data:image/svg+xml," + (new XMLSerializer()).serializeToString(node);
                    if (self.image.complete === true) {
                        resolve(self.image);
                    }
                }) : this.hasFabric().then(function () {
                    return new Promise(function (resolve) {
                        window.html2canvas.svg.fabric.parseSVGDocument(node, self.createCanvas.call(self, resolve));
                    });
                });
            }
            
            SVGNodeContainer.prototype = Object.create(SVGContainer.prototype);
            module.exports = SVGNodeContainer;
        }, {"./svgcontainer": 23}], 25: [function (_dereq_, module, exports) {
            var NodeContainer = _dereq_('./nodecontainer');
            
            function TextContainer(node, parent) {
                NodeContainer.call(this, node, parent);
            }
            
            TextContainer.prototype = Object.create(NodeContainer.prototype);
            TextContainer.prototype.applyTextTransform = function () {
                this.node.data = this.transform(this.parent.css("textTransform"));
            };
            TextContainer.prototype.transform = function (transform) {
                var text = this.node.data;
                switch (transform) {
                    case "lowercase":
                        return text.toLowerCase();
                    case "capitalize":
                        return text.replace(/(^|\s|:|-|\(|\))([a-z])/g, capitalize);
                    case "uppercase":
                        return text.toUpperCase();
                    default:
                        return text;
                }
            };
            
            function capitalize(m, p1, p2) {
                if (m.length > 0) {
                    return p1 + p2.toUpperCase();
                }
            }
            
            module.exports = TextContainer;
        }, {"./nodecontainer": 14}], 26: [function (_dereq_, module, exports) {
            exports.smallImage = function smallImage() {
                return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
            };
            exports.bind = function (callback, context) {
                return function () {
                    return callback.apply(context, arguments);
                };
            };
            /*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */
            exports.decode64 = function (base64) {
                var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                var len = base64.length, i, encoded1, encoded2, encoded3, encoded4, byte1, byte2, byte3;
                var output = "";
                for (i = 0; i < len; i += 4) {
                    encoded1 = chars.indexOf(base64[i]);
                    encoded2 = chars.indexOf(base64[i + 1]);
                    encoded3 = chars.indexOf(base64[i + 2]);
                    encoded4 = chars.indexOf(base64[i + 3]);
                    byte1 = (encoded1 << 2) | (encoded2 >> 4);
                    byte2 = ((encoded2 & 15) << 4) | (encoded3 >> 2);
                    byte3 = ((encoded3 & 3) << 6) | encoded4;
                    if (encoded3 === 64) {
                        output += String.fromCharCode(byte1);
                    } else if (encoded4 === 64 || encoded4 === -1) {
                        output += String.fromCharCode(byte1, byte2);
                    } else {
                        output += String.fromCharCode(byte1, byte2, byte3);
                    }
                }
                return output;
            };
            exports.getBounds = function (node) {
                if (node.getBoundingClientRect) {
                    var clientRect = node.getBoundingClientRect();
                    var width = node.offsetWidth == null ? clientRect.width : node.offsetWidth;
                    return {
                        top: clientRect.top,
                        bottom: clientRect.bottom || (clientRect.top + clientRect.height),
                        right: clientRect.left + width,
                        left: clientRect.left,
                        width: width,
                        height: node.offsetHeight == null ? clientRect.height : node.offsetHeight
                    };
                }
                return {};
            };
            exports.offsetBounds = function (node) {
                var parent = node.offsetParent ? exports.offsetBounds(node.offsetParent) : {top: 0, left: 0};
                return {
                    top: node.offsetTop + parent.top,
                    bottom: node.offsetTop + node.offsetHeight + parent.top,
                    right: node.offsetLeft + parent.left + node.offsetWidth,
                    left: node.offsetLeft + parent.left,
                    width: node.offsetWidth,
                    height: node.offsetHeight
                };
            };
            exports.parseBackgrounds = function (backgroundImage) {
                var whitespace = ' \r\n\t',
                    method, definition, prefix, prefix_i, block, results = [],
                    mode = 0, numParen = 0, quote, args;
                var appendResult = function () {
                    if (method) {
                        if (definition.substr(0, 1) === '"') {
                            definition = definition.substr(1, definition.length - 2);
                        }
                        if (definition) {
                            args.push(definition);
                        }
                        if (method.substr(0, 1) === '-' && (prefix_i = method.indexOf('-', 1) + 1) > 0) {
                            prefix = method.substr(0, prefix_i);
                            method = method.substr(prefix_i);
                        }
                        results.push({
                            prefix: prefix,
                            method: method.toLowerCase(),
                            value: block,
                            args: args,
                            image: null
                        });
                    }
                    args = [];
                    method = prefix = definition = block = '';
                };
                args = [];
                method = prefix = definition = block = '';
                backgroundImage.split("").forEach(function (c) {
                    if (mode === 0 && whitespace.indexOf(c) > -1) {
                        return;
                    }
                    switch (c) {
                        case '"':
                            if (!quote) {
                                quote = c;
                            } else if (quote === c) {
                                quote = null;
                            }
                            break;
                        case '(':
                            if (quote) {
                                break;
                            } else if (mode === 0) {
                                mode = 1;
                                block += c;
                                return;
                            } else {
                                numParen++;
                            }
                            break;
                        case ')':
                            if (quote) {
                                break;
                            } else if (mode === 1) {
                                if (numParen === 0) {
                                    mode = 0;
                                    block += c;
                                    appendResult();
                                    return;
                                } else {
                                    numParen--;
                                }
                            }
                            break;
                        case ',':
                            if (quote) {
                                break;
                            } else if (mode === 0) {
                                appendResult();
                                return;
                            } else if (mode === 1) {
                                if (numParen === 0 && !method.match(/^url$/i)) {
                                    args.push(definition);
                                    definition = '';
                                    block += c;
                                    return;
                                }
                            }
                            break;
                    }
                    block += c;
                    if (mode === 0) {
                        method += c;
                    } else {
                        definition += c;
                    }
                });
                appendResult();
                return results;
            };
        }, {}], 27: [function (_dereq_, module, exports) {
            var GradientContainer = _dereq_('./gradientcontainer');
            
            function WebkitGradientContainer(imageData) {
                GradientContainer.apply(this, arguments);
                this.type = imageData.args[0] === "linear" ? GradientContainer.TYPES.LINEAR : GradientContainer.TYPES.RADIAL;
            }
            
            WebkitGradientContainer.prototype = Object.create(GradientContainer.prototype);
            module.exports = WebkitGradientContainer;
        }, {"./gradientcontainer": 9}], 28: [function (_dereq_, module, exports) {
            function XHR(url) {
                return new Promise(function (resolve, reject) {
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', url);
                    xhr.onload = function () {
                        if (xhr.status === 200) {
                            resolve(xhr.responseText);
                        } else {
                            reject(new Error(xhr.statusText));
                        }
                    };
                    xhr.onerror = function () {
                        reject(new Error("Network Error"));
                    };
                    xhr.send();
                });
            }
            
            module.exports = XHR;
        }, {}]
    }, {}, [4])(4)
});
/**
 * @require /libsH5/js/libs/three.js
 * @require /libsH5/js/libs/WebViewer.js
 */
var CLOUD = CLOUD || {};
CLOUD.Extensions = CLOUD.Extensions || {};
CLOUD.Extensions.Utils = CLOUD.Extensions.Utils || {};
CLOUD.Extensions.Utils.Geometric = {
    isInsideBounds: function (x, y, bounds) {
        return x >= bounds.x && x <= bounds.x + bounds.width &&
            y >= bounds.y && y <= bounds.y + bounds.height;
    },
    getAngleBetweenPoints: function (p1, p2) {
        return Math.atan2(p2.y - p1.y, p2.x - p1.x);
    },
    // 判断是否同一个点
    isEqualBetweenPoints: function (p1, p2, epsilon) {
        epsilon = epsilon || 0.0001;
        var dx = p1.x - p2.x;
        var dy = p1.y - p2.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > epsilon) {
            return false;
        }
        return true;
    }
};
var CLOUD = CLOUD || {};
CLOUD.Extensions = CLOUD.Extensions || {};
CLOUD.Extensions.Utils = CLOUD.Extensions.Utils || {};
CLOUD.Extensions.Utils.Shape2D = {
    createSvgElement: function (type) {
        var xmlns = 'http://www.w3.org/2000/svg';
        var svg = document.createElementNS(xmlns, type);
        svg.setAttribute('pointer-events', 'inherit');
        return svg;
    },
    getRGBAString: function (hexRGBString, opacity) {
        if (opacity <= 0) {
            return 'none';
        }
        var rgba = ['rgba(' +
        parseInt('0x' + hexRGBString.substr(1, 2)), ',',
            parseInt('0x' + hexRGBString.substr(3, 2)), ',',
            parseInt('0x' + hexRGBString.substr(5, 2)), ',', opacity, ')'].join('');
        return rgba;
    },
    makeFlag: function () {
        var path = "M0 0 L0 -20 L15 -13 L4 -6.87 L4 0Z";
        var shape = this.createSvgElement('path');
        shape.setAttribute('d', path);
        return shape;
    },
    makeBubble: function () {
        var path = "m0.0035,-19.88544c-3.838253,0 -6.95,2.581968 -6.95,5.766754c0,3.185555 6.95,13.933247 6.95,13.933247s6.95,-10.747692 6.95,-13.933247c0,-3.184786 -3.11082,-5.766754 -6.95,-5.766754z";
        var shape = this.createSvgElement('path');
        shape.setAttribute('d', path);
        return shape;
    },
    makeCommon: function (url) {
        var shape = this.createSvgElement('image');
        shape.href.baseVal = url;
        shape.setAttribute('height', '50px');
        shape.setAttribute('width', '50px');
        return shape;
    }
};
CLOUD.MiniMap = function (viewer) {
    this.viewer = viewer;
    this.visible = true;
    this.width = 0;
    this.height = 0;
    this.domContainer = null;
    this.autoClear = true;
    this.mouseButtons = {LEFT: THREE.MOUSE.LEFT, RIGHT: THREE.MOUSE.RIGHT};
    this.callbackCameraChanged = null;
    this.callbackClickOnAxisGrid = null;
    this.initialized = false;
    this.axisGirds = null;
    var scope = this;
    var _mapContainer;
    var normalizedMouse = new THREE.Vector2();
    var _clearColor = new THREE.Color(), _clearAlpha = 1;
    var _defaultClearColor = 0x333333;//0xffffff; // 0xadadad; // 缺省背景色
    var _materialColor = 0x999999;
    // 轴网材质
    var _materialGrid = new THREE.LineBasicMaterial({
        color: _materialColor,
        linewidth: 0.5
    });
    var _xmlns = "http://www.w3.org/2000/svg";
    //var _svg = document.createElementNS(_xmlns, 'svg');
    //var _svgGroupForAxisGrid = document.createElementNS(_xmlns, "g");
    var _svg, _svgGroupForAxisGrid;
    var _svgPathPool = [], _svgLinePool = [], _svgTextPool = [], _svgImagePool = [], _svgCirclePool = [],
        _pathCount = 0, _lineCount = 0, _textCount = 0, _imageCount = 0, _circleCount = 0, _quality = 1;
    var _svgNode, _svgWidth, _svgHeight, _svgHalfWidth, _svgHalfHeight;
    var _clipBox2D = new THREE.Box2(), _elemBox2D = new THREE.Box2(), _axisGridBox2D = new THREE.Box2();
    var _axisGridElements = [], _axisGridIntersectionPoints = [], _axisGridLevels = [];
    var _axisGridNumberCircleRadius = 10, _axisGridNumberFontSize = 8, _axisGridNumberInterval = 3; // 轴号间隔
    var _isShowAxisGrid = false, _isLoadedAxisGrid = false, _isLoadedFloorPlane = false;
    var _enableFlyByClick = true; // 是否允许click飞到指定位置
    var _tipNode, _circleNode, _highlightHorizLineNode, _highlightVerticalLineNode, _cameraNode, _cameraArrowNode,
        _cameraCircleNode;
    var _highlightColor = '#258ae3', _tipNodeColor = "#000", _tipNodeBackgroundColor = "#fff";
    var _highlightLineWidth = 1, _circleNodeRadius = 3;
    var _hasHighlightInterPoint = false;
    var _floorPlaneMinZ = 0; // 平面图最小高度
    var _cameraProjectedPosZ = 0; // 相机投影点位置高度
    var _floorPlaneBox, _floorPlaneUrl;
    var _enableShowCamera = true;
    var _lastCameraWorldPosition;
    var _epsilon = 0.00001;
    var _isNormalizeMousePoint = false;
    var _isChangeView = false;
    var _axisGridExpandSize = 100; // 100mm
    // ------------- 这些算法可以独立成单独文件 S ------------- //
    function cross(p1, p2, p3, p4) {
        return (p2.x - p1.x) * (p4.y - p3.y) - (p2.y - p1.y) * (p4.x - p3.x);
    }
    
    // 获得三角形面积(S = |AB * AC|)
    function getArea(p1, p2, p3) {
        return cross(p1, p2, p1, p3);
    }
    
    // 获得三角形面积
    function getAbsArea(p1, p2, p3) {
        return Math.abs(getArea(p1, p2, p3));
    }
    
    // 计算交点
    function getInterPoint(p1, p2, p3, p4) {
        var s1 = getAbsArea(p1, p2, p3);
        var s2 = getAbsArea(p1, p2, p4);
        var interPoint = new THREE.Vector2((p4.x * s1 + p3.x * s2) / (s1 + s2), (p4.y * s1 + p3.y * s2) / (s1 + s2));
        return interPoint;
    }
    
    //判断两向量角度是否大于180°，大于180°返回真，否则返回假
    function isAngleGreaterThanPi(start, end, up) {
        
        // 根据混合积来判断角度
        var dir = new THREE.Vector3();
        dir.crossVectors(start, end);
        var volume = dir.dot(up);
        //dir 与 up 同向 - 小于 180°
        if (volume >= 0) {
            return false;
        }
        return true;
    }
    
    // ------------- 这些算法可以独立成单独文件 E ------------- //
    // 正规化坐标转屏幕坐标
    function normalizedPointToScreen(point) {
        point.x = point.x * _svgHalfWidth;
        point.y = -point.y * _svgHalfHeight;
    }
    
    // 屏幕坐标转正规化坐标
    function screenToNormalizedPoint(point) {
        point.x = point.x / _svgHalfWidth;
        point.y = -point.y / _svgHalfHeight;
    }
    
    // 正规化屏幕坐标转世界坐标
    function normalizedPointToWorld(point) {
        var boxSize = _axisGridBox2D.getSize();
        point.x = 0.5 * (point.x + 1) * boxSize.x + _axisGridBox2D.min.x;
        point.y = 0.5 * (point.y + 1) * boxSize.y + _axisGridBox2D.min.y;
    }
    
    // 世界坐标转正规化屏幕坐标 [-1, 1]
    function worldToNormalizedPoint(point) {
        var boxSize = _axisGridBox2D.getSize();
        point.x = (point.x - _axisGridBox2D.min.x) / boxSize.x * 2 - 1;
        point.y = (point.y - _axisGridBox2D.min.y) / boxSize.y * 2 - 1;
    }
    
    function loadStyleString(css) {
        var style = document.createElement("style");
        style.type = "text/css";
        try {
            style.appendChild(document.createTextNode(css));
        } catch (ex) {
            style.styleSheet.cssText = css;
        }
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(style);
    }
    
    function getImageNode(id) {
        if (_svgImagePool[id] == null) {
            _svgImagePool[id] = document.createElementNS(_xmlns, 'image');
            return _svgImagePool[id];
        }
        return _svgImagePool[id];
    }
    
    function getPathNode(id) {
        if (_svgPathPool[id] == null) {
            _svgPathPool[id] = document.createElementNS(_xmlns, 'path');
            if (_quality == 0) {
                _svgPathPool[id].setAttribute('shape-rendering', 'crispEdges'); //optimizeSpeed
            }
            return _svgPathPool[id];
        }
        return _svgPathPool[id];
    }
    
    function getLineNode(id) {
        if (_svgLinePool[id] == null) {
            _svgLinePool[id] = document.createElementNS(_xmlns, 'line');
            if (_quality == 0) {
                _svgLinePool[id].setAttribute('shape-rendering', 'crispEdges'); //optimizeSpeed
            }
            return _svgLinePool[id];
        }
        return _svgLinePool[id];
    }
    
    function getCircleNode(id) {
        if (_svgCirclePool[id] == null) {
            _svgCirclePool[id] = document.createElementNS(_xmlns, 'circle');
            if (_quality == 0) {
                _svgCirclePool[id].setAttribute('shape-rendering', 'crispEdges'); //optimizeSpeed
            }
            return _svgCirclePool[id];
        }
        return _svgCirclePool[id];
    }
    
    function getTextNode(id) {
        if (_svgTextPool[id] == null) {
            _svgTextPool[id] = document.createElementNS(_xmlns, 'text');
            if (_quality == 0) {
                _svgTextPool[id].setAttribute('shape-rendering', 'crispEdges'); //optimizeSpeed
            }
            return _svgTextPool[id];
        }
        return _svgTextPool[id];
    }
    
    // 绘制线条
    function renderLine(v1, v2, material) {
        _svgNode = getLineNode(_lineCount++);
        _svgNode.setAttribute('x1', v1.x);
        _svgNode.setAttribute('y1', v1.y);
        _svgNode.setAttribute('x2', v2.x);
        _svgNode.setAttribute('y2', v2.y);
        if (material instanceof THREE.LineBasicMaterial) {
            _svgNode.setAttribute('style', 'fill: none; stroke: ' + material.color.getStyle() + '; stroke-width: ' + material.linewidth + '; stroke-opacity: ' + material.opacity + '; stroke-linecap: ' + material.linecap + '; stroke-linejoin: ' + material.linejoin);
            _svgGroupForAxisGrid.appendChild(_svgNode);
        }
    }
    
    // 绘制圆
    function renderCircle(cx, cy, material) {
        _svgNode = getCircleNode(_circleCount++);
        _svgNode.setAttribute('r', _axisGridNumberCircleRadius + '');
        _svgNode.setAttribute('transform', 'translate(' + cx + ',' + cy + ')');
        if (material instanceof THREE.LineBasicMaterial) {
            _svgNode.setAttribute('style', 'fill: none; stroke: ' + material.color.getStyle() + '; stroke-width: 1');
            _svgGroupForAxisGrid.appendChild(_svgNode);
        }
    }
    
    // 绘制文本
    function renderText(cx, cy, literal, material) {
        _svgNode = getTextNode(_textCount++);
        if (material instanceof THREE.LineBasicMaterial) {
            _svgNode.setAttribute('style', 'font-size:' + _axisGridNumberFontSize + 'px; fill: none; stroke: ' + material.color.getStyle() + '; stroke-width: 1');
            _svgGroupForAxisGrid.appendChild(_svgNode);
        }
        _svgNode.innerHTML = literal;
        // 注意: 必须已加到document中才能求到getBoundingClientRect
        var box = _svgNode.getBoundingClientRect();
        var offsetX = cx - 0.5 * box.width;
        var offsetY = cy + 0.25 * box.height;
        _svgNode.setAttribute('transform', 'translate(' + offsetX + ',' + offsetY + ')');
    }
    
    // 绘制平面图
    function renderFloorPlan() {
        if (_isLoadedFloorPlane) {
            _svgNode = getImageNode(0);
            _svg.appendChild(_svgNode);
        }
    }
    
    // 绘制高亮提示
    function renderHighlightNode() {
        _svg.appendChild(_highlightHorizLineNode);
        _svg.appendChild(_highlightVerticalLineNode);
        _svg.appendChild(_circleNode);
    }
    
    // 绘制轴网
    function renderAxisGrid() {
        _svg.appendChild(_svgGroupForAxisGrid);
        for (var i = 0, len = _axisGridElements.length; i < len; i++) {
            var lineElements = _axisGridElements[i];
            for (var j = 0, len2 = lineElements.length; j < len2; j++) {
                var element = lineElements[j];
                var v1 = element.v1.clone();
                var v2 = element.v2.clone();
                var material = element.material;
                _elemBox2D.makeEmpty();
                _elemBox2D.setFromPoints([v1, v2]);
                if (_clipBox2D.isIntersectionBox(_elemBox2D) === true) {
                    renderLine(v1, v2, material);
                    // 绘制轴号
                    if (j % _axisGridNumberInterval == 0) {
                        var dir = new THREE.Vector2();
                        dir.subVectors(v2, v1).normalize().multiplyScalar(_axisGridNumberCircleRadius);
                        var newV1 = v1.clone().sub(dir);
                        var newV2 = v2.clone().add(dir);
                        renderCircle(newV1.x, newV1.y, material);
                        renderCircle(newV2.x, newV2.y, material);
                        renderText(newV1.x, newV1.y, element.name, material);
                        renderText(newV2.x, newV2.y, element.name, material);
                    }
                }
            }
        }
    }
    
    // 设置容器元素style
    function setContainerElementStyle(container, styleOptions) {
        var defaultStyle = {
            position: "absolute",
            display: "block",
            left: "20px",
            bottom: "20px",
            outline: "#0000FF dotted thin"
            //opacity: ".6",
            //border: "red solid thin",
            //webkitTransition: "opacity .2s ease",
            //mozTransition: "opacity .2s ease",
            //msTransform: "opacity .2s ease",
            //oTransform: "opacity .2s ease",
            //transition: "opacity .2s ease"
        };
        styleOptions = styleOptions || defaultStyle;
        for (var attr in styleOptions) {
            //console.log(attr);
            container.style[attr] = styleOptions[attr];
        }
        //container.style.position = style.position;
        //container.style.display = style.display;
        //container.style.outline = style.outline;
        //container.style.left = style.left;
        //container.style.bottom = style.bottom;
    }
    
    function transformWorldPoint(point) {
        var sceneMatrix = scope.getMainSceneMatrix();
        point.applyMatrix4(sceneMatrix);
    }
    
    // 调整轴网
    function adjustAxisGrid(grids, mapMaxBox) {
        var newBox2D = new THREE.Box2();
        var newGrids = [];
        var specifiedMaxBox = new THREE.Box2(new THREE.Vector2(mapMaxBox[0], mapMaxBox[1]), new THREE.Vector2(mapMaxBox[2], mapMaxBox[3]));
        var horizLineElements = []; // 水平线集合
        var verticalLineElements = []; // 垂直线集
        var i = 0, j = 0, len = grids.length;
        // 计算轴网包围盒
        for (i = 0; i < len; i++) {
            var grid = grids[i];
            var startPt = grid.start || grid.Start;
            var endPt = grid.end || grid.End;
            var start = new THREE.Vector2(startPt.X, startPt.Y);
            var end = new THREE.Vector2(endPt.X, endPt.Y);
            var dir = end.clone().sub(start).normalize();
            if (Math.abs(dir.x) >= Math.abs(dir.y)) {
                // 水平方向线条
                horizLineElements.push({v1: start, v2: end});
            } else {
                // 垂直方向线条
                verticalLineElements.push({v1: start, v2: end});
            }
        }
        // 计算交点
        var horizLineElementsLen = horizLineElements.length;
        var verticalLineElementsLen = verticalLineElements.length;
        var horizLine, verticalLine;
        var p1, p2, p3, p4;
        for (i = 0; i < horizLineElementsLen; i++) {
            horizLine = horizLineElements[i];
            p1 = horizLine.v1.clone();
            p2 = horizLine.v2.clone();
            for (j = 0; j < verticalLineElementsLen; j++) {
                verticalLine = verticalLineElements[j];
                p3 = verticalLine.v1.clone();
                p4 = verticalLine.v2.clone();
                // 获得交点
                var interPoint = getInterPoint(p1, p2, p3, p4);
                newBox2D.expandByPoint(interPoint);
            }
        }
        newBox2D.union(specifiedMaxBox);
        // 扩展大小
        newBox2D.expandByScalar(_axisGridExpandSize);
        // 计算轴网包围盒
        for (i = 0; i < len; i++) {
            var grid = grids[i];
            var name = grid.name || grid.Name;
            var startPt = grid.start || grid.Start;
            var endPt = grid.end || grid.End;
            var start = new THREE.Vector2(startPt.X, startPt.Y);
            var end = new THREE.Vector2(endPt.X, endPt.Y);
            var dir = end.clone().sub(start).normalize();
            if (Math.abs(dir.x) >= Math.abs(dir.y)) {
                // 水平方向线条
                start.x = newBox2D.max.x;
                end.x = newBox2D.min.x;
                newGrids.push({name: name, start: {X: start.x, Y: start.y}, end: {X: end.x, Y: end.y}});
            } else {
                // 垂直方向线条
                start.y = newBox2D.min.y;
                end.y = newBox2D.max.y;
                newGrids.push({name: name, start: {X: start.x, Y: start.y}, end: {X: end.x, Y: end.y}});
            }
        }
        return newGrids;
    }
    
    // 计算轴网包围盒
    function calculateAxisGridBox(grids) {
        _axisGridBox2D.makeEmpty();
        // 计算轴网包围盒
        for (var i = 0, len = grids.length; i < len; i++) {
            var grid = grids[i];
            var startPt = grid.start || grid.Start;
            var endPt = grid.end || grid.End;
            var start = new THREE.Vector2(startPt.X, startPt.Y);
            var end = new THREE.Vector2(endPt.X, endPt.Y);
            _axisGridBox2D.expandByPoint(start);
            _axisGridBox2D.expandByPoint(end);
        }
        var center = _axisGridBox2D.getCenter();
        var oldSize = _axisGridBox2D.getSize();
        var newSize = new THREE.Vector2();
        var offset = 4;
        //
        //if (_isShowAxisGrid) {
        //
        //    //var center = _axisGridBox2D.getCenter();
        //    //var oldSize = _axisGridBox2D.size();
        //    //var newSize = new THREE.Vector2();
        //    newSize.x = oldSize.x * _svgWidth / (_svgWidth - 4.0 * (_axisGridNumberCircleRadius + offset));
        //    newSize.y = oldSize.y * _svgHeight / (_svgHeight - 4.0 * (_axisGridNumberCircleRadius + offset));
        //
        //    _axisGridBox2D.setFromCenterAndSize(center, newSize);
        //}
        // 扩展边框盒
        var svgAspect = _svgWidth / _svgHeight;
        var boxAspect = oldSize.x / oldSize.y;
        var newWidth = oldSize.x;
        var newHeight = oldSize.y;
        // 横向边较长 - 上下扩展
        if (boxAspect > svgAspect) {
            
            // 显示轴号，则先扩展横向边长，再求纵向边长
            if (_isShowAxisGrid) {
                newWidth = oldSize.x * _svgWidth / (_svgWidth - 4.0 * (_axisGridNumberCircleRadius + offset));
            }
            newHeight = newWidth / svgAspect;
        } else if (boxAspect < svgAspect) { // 左右扩展
            // 显示轴号，则先扩展纵向边长，再求横向边长
            if (_isShowAxisGrid) {
                newHeight = oldSize.y * _svgHeight / (_svgHeight - 4.0 * (_axisGridNumberCircleRadius + offset));
            }
            newWidth = newHeight * svgAspect;
        }
        newSize.set(newWidth, newHeight);
        _axisGridBox2D.setFromCenterAndSize(center, newSize);
    }
    
    // 计算轴网交叉点
    function calculateAxisGridIntersection(grids, material) {
        if (_axisGridElements.length > 0) {
            //_axisGridElements.splice(0,_axisGridElements.length);
            _axisGridElements = [];
        }
        if (_axisGridIntersectionPoints.length > 0) {
            _axisGridIntersectionPoints = [];
        }
        var horizLineElements = []; // 水平线集合
        var verticalLineElements = []; // 垂直线集
        var i = 0, j = 0, len = grids.length;
        for (i = 0; i < len; i++) {
            var grid = grids[i];
            var name = grid.name || grid.Name;
            var startPt = grid.start || grid.Start;
            var endPt = grid.end || grid.End;
            var start = new THREE.Vector2(startPt.X, startPt.Y);
            var end = new THREE.Vector2(endPt.X, endPt.Y);
            worldToNormalizedPoint(start);
            normalizedPointToScreen(start);
            worldToNormalizedPoint(end);
            normalizedPointToScreen(end);
            var dir = end.clone().sub(start).normalize();
            if (Math.abs(dir.x) >= Math.abs(dir.y)) {
                // 水平方向线条
                horizLineElements.push({name: name, v1: start, v2: end, material: material});
            } else {
                // 垂直方向线条
                verticalLineElements.push({name: name, v1: start, v2: end, material: material});
            }
        }
        _axisGridElements.push(horizLineElements);
        _axisGridElements.push(verticalLineElements);
        // 计算交点
        var horizLineElementsLen = horizLineElements.length;
        var verticalLineElementsLen = verticalLineElements.length;
        var horizLine, verticalLine, numeralName, abcName;
        var p1, p2, p3, p4;
        for (i = 0; i < horizLineElementsLen; i++) {
            horizLine = horizLineElements[i];
            abcName = horizLine.name;
            p1 = horizLine.v1.clone();
            p2 = horizLine.v2.clone();
            for (j = 0; j < verticalLineElementsLen; j++) {
                verticalLine = verticalLineElements[j];
                numeralName = verticalLine.name;
                p3 = verticalLine.v1.clone();
                p4 = verticalLine.v2.clone();
                // 获得交点
                var interPoint = getInterPoint(p1, p2, p3, p4);
                _axisGridIntersectionPoints.push({
                    intersectionPoint: interPoint,
                    horizLine: [p1.clone(), p2.clone()],
                    verticalLine: [p3.clone(), p4.clone()],
                    abcName: abcName,
                    numeralName: numeralName
                });
            }
        }
    }
    
    this.enableMouseEvent = function (enable) {
        _enableFlyByClick = enable;
        //this.render();
    };
    this.isEnableMouseEvent = function () {
        return _enableFlyByClick;
    };
    this.isMouseOverCanvas = function (mouse) {
        var domElement = _mapContainer;
        _isNormalizeMousePoint = false;
        if (domElement) {
            var dim = CLOUD.DomUtil.getContainerOffsetToClient(domElement);
            var canvasMouse = new THREE.Vector2();
            // 计算鼠标点相对于所在视口的位置
            canvasMouse.x = mouse.x - dim.left;
            canvasMouse.y = mouse.y - dim.top;
            if (dim.width === 0 || dim.height === 0) {
                return false;
            }
            // 规范化坐标系[-1, 1]
            if (canvasMouse.x > 0 && canvasMouse.x < this.width && canvasMouse.y > 0 && canvasMouse.y < this.height) {
                normalizedMouse.x = canvasMouse.x / this.width * 2 - 1;
                normalizedMouse.y = -canvasMouse.y / this.height * 2 + 1;
                _isNormalizeMousePoint = true;
                return true;
            }
        }
        return false;
    };
    // 主场景面板鼠标运动状态
    // 主场景面板的mouse move 和 mouse up 注册在 window 上，
    // 当鼠标从主场景移动到其他元素上时，不响应其他元素的事件
    this.isMouseMoving = function () {
        return !this.isMouseDown;
    };
    this.onMouseDown = function (event) {
        if (!this.isMouseDown) {
            return;
        }
        this.isMouseDown = true;
    };
    this.onMouseMove = function (event) {
        if (!this.isMouseDown) {
            return;
        }
        if (!_enableFlyByClick) return;
        var mouse = new THREE.Vector2(event.clientX, event.clientY);
        var isOverCanvas = this.isMouseOverCanvas(mouse);
        this.highlightedNode(isOverCanvas, _isShowAxisGrid, false);
    };
    this.onMouseUp = function (event) {
        if (!this.isMouseDown) {
            return;
        }
        this.isMouseDown = false;
        var mouse = new THREE.Vector2(event.clientX, event.clientY);
        var isOverCanvas = this.isMouseOverCanvas(mouse);
        var isExistData = _isLoadedAxisGrid || _isLoadedFloorPlane;
        if (!_enableFlyByClick) {
            this.highlightedNode(isOverCanvas, _isShowAxisGrid, true);
            return;
        }
        if (isOverCanvas && isExistData) {
            
            // 计算选中点的坐标
            var clickPoint = new THREE.Vector3();
            var clickPoint2D = normalizedMouse.clone();
            normalizedPointToWorld(clickPoint2D);
            // 如果靠近交点，使用交点会更好，不然感觉靠近交点高亮时，点击的位置不一致。
            var screenPosition = normalizedMouse.clone();
            normalizedPointToScreen(screenPosition);
            // 获得最近的交点
            var intersection = this.getIntersectionToMinDistance(screenPosition);
            if (intersection) {
                // 计算轴信息
                var interPoint = new THREE.Vector2(intersection.intersectionPoint.x, intersection.intersectionPoint.y);
                var offset = screenPosition.sub(interPoint);
                if (offset.lengthSq() < _circleNodeRadius * _circleNodeRadius) {
                    var interScreenPoint = interPoint.clone();
                    screenToNormalizedPoint(interScreenPoint);
                    normalizedPointToWorld(interScreenPoint);
                    clickPoint.set(interScreenPoint.x, interScreenPoint.y, _cameraProjectedPosZ);
                } else {
                    clickPoint.set(clickPoint2D.x, clickPoint2D.y, _cameraProjectedPosZ);
                }
            } else {
                clickPoint.set(clickPoint2D.x, clickPoint2D.y, _cameraProjectedPosZ);
            }
            transformWorldPoint(clickPoint);
            this.flyToPointWithParallelEye(clickPoint);
        }
    };
    this.onContextMenu = function (event) {
        event.preventDefault();
    };
    this.onMouseDownBinded = this.onMouseDown.bind(this);
    this.onMouseMoveBinded = this.onMouseMove.bind(this);
    this.onMouseUpBinded = this.onMouseUp.bind(this);
    this.onContextMenuBinded = this.onContextMenu.bind(this);
    this.addDomEventListeners = function () {
        if (_mapContainer) {
            _mapContainer.addEventListener('contextmenu', this.onContextMenuBinded, false);
            _mapContainer.addEventListener('mousedown', this.onMouseDownBinded, false);
            _mapContainer.addEventListener('mousemove', this.onMouseMoveBinded, false);
            _mapContainer.addEventListener('mouseup', this.onMouseUpBinded, false);
        }
    };
    this.removeDomEventListeners = function () {
        if (_mapContainer) {
            _mapContainer.removeEventListener('contextmenu', this.onContextMenuBinded, false);
            _mapContainer.removeEventListener('mousedown', this.onMouseDownBinded, false);
            _mapContainer.removeEventListener('mousemove', this.onMouseMoveBinded, false);
            _mapContainer.removeEventListener('mouseup', this.onMouseUpBinded, false);
        }
    };
    this.init = function (domContainer, width, height, styleOptions, alpha) {
        width = width || 320;
        height = height || 240;
        alpha = alpha || 0;
        if (!_svg) {
            _svg = document.createElementNS(_xmlns, 'svg');
            _svgGroupForAxisGrid = document.createElementNS(_xmlns, "g");
        }
        // 初始化绘图面板
        this.initCanvasContainer(domContainer, styleOptions);
        // 初始化提示节点
        this.initTipNode();
        this.initCameraNode();
        // 设置绘图面板大小
        this.setSize(width, height);
        // 设置绘图面板背景色
        this.setClearColor(_defaultClearColor, alpha);
        this.clear();
        this.addDomEventListeners();
        _hasHighlightInterPoint = false;
        if (this.callbackClickOnAxisGrid) {
            var gridInfo = {
                position: '',
                abcName: '',
                numeralName: '',
                offsetX: '',
                offsetY: ''
            };
            this.callbackClickOnAxisGrid(gridInfo);
        }
        this.initialized = true;
    };
    this.uninit = function () {
        if (this.initialized) {
            this.initialized = false;
            this.removeDomEventListeners();
            this.clear();
            if (_svg.parentNode) {
                _svg.parentNode.removeChild(_svg)
            }
            this.remove();
            _mapContainer = null;
            _svg = null;
            _svgGroupForAxisGrid = null;
            this.domContainer = null;
            this.callbackCameraChanged = null;
            this.callbackClickOnAxisGrid = null;
            this.axisGirds = null;
        }
    };
    // 设置绘图面板大小
    this.setSize = function (width, height) {
        if (_mapContainer) {
            this.width = width;
            this.height = height;
            _mapContainer.style.width = width + "px";
            _mapContainer.style.height = height + "px";
            _svgWidth = width;
            _svgHeight = height;
            _svgHalfWidth = _svgWidth / 2;
            _svgHalfHeight = _svgHeight / 2;
            _svg.setAttribute('viewBox', (-_svgHalfWidth) + ' ' + (-_svgHalfHeight) + ' ' + _svgWidth + ' ' + _svgHeight);
            _svg.setAttribute('width', _svgWidth);
            _svg.setAttribute('height', _svgHeight);
            _clipBox2D.min.set(-_svgHalfWidth, -_svgHalfHeight);
            _clipBox2D.max.set(_svgHalfWidth, _svgHalfHeight);
            //this.resizeClientAxisGrid();
            //
            //_svgGroupForAxisGrid.style.display = "";
            //
            //if (_hasHighlightInterPoint) {
            //    this.showTip();
            //}
            //
            //this.render();
        }
    };
    // 设置绘图面板背景色
    this.setClearColor = function (color, alpha) {
        _clearColor.set(color);
        _clearAlpha = alpha !== undefined ? alpha : 1;
    };
    this.clear = function () {
        _pathCount = 0;
        _lineCount = 0;
        _textCount = 0;
        _imageCount = 0;
        _circleCount = 0;
        while (_svg.childNodes.length > 0) {
            while (_svg.childNodes[0] > 0) {
                _svg.childNodes[0].removeChild(_svg.childNodes[0].childNodes[0]);
            }
            _svg.removeChild(_svg.childNodes[0]);
        }
        _svg.style.backgroundColor = 'rgba(' + ((_clearColor.r * 255) | 0) + ',' + ((_clearColor.g * 255) | 0) + ',' + ((_clearColor.b * 255) | 0) + ',' + _clearAlpha + ')';
    };
    this.render = function () {
        if (!_isLoadedAxisGrid) return;
        if (this.autoClear) this.clear();
        if (!this.visible) return;
        renderFloorPlan();
        if (_isShowAxisGrid) {
            renderAxisGrid();
            renderHighlightNode();
        }
        this.calculateCameraPosition();
        if (_enableShowCamera) {
            _svg.appendChild(_cameraNode);
        }
    };
    // 初始化绘图面板
    this.initCanvasContainer = function (domContainer, styleOptions) {
        this.domContainer = domContainer;
        if (!_mapContainer) {
            _mapContainer = document.createElement("div");
            setContainerElementStyle(_mapContainer, styleOptions);
            domContainer.appendChild(_mapContainer);
            _mapContainer.appendChild(_svg);
        }
    };
    // 初始化相机图形节点
    this.initCameraNode = function () {
        if (!_cameraNode) {
            _cameraNode = document.createElementNS(_xmlns, 'g');
            _cameraNode.setAttribute('fill', '#1b8cef');
            _cameraNode.setAttribute('stroke', '#cbd7e1');
            _cameraNode.setAttribute('stroke-width', '1');
            _cameraNode.setAttribute('stroke-linejoin', 'round');
            //_cameraNode.setAttribute('opacity', '0.0');
            // 尺寸大小 直径 12px
            var circle = document.createElementNS(_xmlns, 'circle');
            circle.setAttribute('r', '6');
            _cameraCircleNode = circle;
            var path = document.createElementNS(_xmlns, 'path');
            path.setAttribute('d', 'M 7 6 Q 10 0, 7 -6 L 19 0 Z');
            _cameraArrowNode = path;
            _cameraNode.appendChild(circle);
            _cameraNode.appendChild(path);
        }
        _cameraNode.setAttribute('opacity', '0.0');
    };
    // 初始化提示节点
    this.initTipNode = function () {
        if (!_tipNode) {
            
            // 指示箭头样式
            var css = ".cloud-tip:after { " +
                "box-sizing: border-box;" +
                "display: inline;" +
                "font-size: 10px;" +
                "width: 100%;" +
                "line-height: 1;" +
                "color: " + _tipNodeBackgroundColor + ";" +
                "content: '\\25BC';" +
                "position: absolute;" +
                "text-align: center;" +
                "margin: -4px 0 0 0;" +
                "top: 100%;" +
                "left: 0;" +
                "}";
            loadStyleString(css);
            _tipNode = document.createElement('div');
            _tipNode.className = "";
            //_tipNode.className = "cloud-tip";
            _tipNode.style.position = "absolute";
            _tipNode.style.display = "block";
            _tipNode.style.background = _tipNodeBackgroundColor;
            _tipNode.style.color = _tipNodeColor;
            _tipNode.style.padding = "0 8px 0 8px";
            _tipNode.style.borderRadius = "2px";
            _tipNode.style.fontSize = "8px";
            //_tipNode.style.opacity = 0;
            _mapContainer.appendChild(_tipNode);
        }
        _tipNode.style.opacity = 0;
        if (!_circleNode) {
            _circleNode = document.createElementNS(_xmlns, 'circle');
            _circleNode.setAttribute('r', _circleNodeRadius + '');
            _circleNode.setAttribute('fill', _highlightColor);
            //_circleNode.style.opacity = 0;
        }
        _circleNode.style.opacity = 0;
        if (!_highlightHorizLineNode) {
            _highlightHorizLineNode = document.createElementNS(_xmlns, 'line');
            _highlightHorizLineNode.setAttribute('style', 'stroke:' + _highlightColor + ';stroke-width:' + _highlightLineWidth + '');
            //_highlightHorizLineNode.style.opacity = 0;
        }
        _highlightHorizLineNode.style.opacity = 0;
        if (!_highlightVerticalLineNode) {
            _highlightVerticalLineNode = document.createElementNS(_xmlns, 'line');
            _highlightVerticalLineNode.setAttribute('style', 'stroke:' + _highlightColor + ';stroke-width:' + _highlightLineWidth + '');
            //_highlightVerticalLineNode.style.opacity = 0;
        }
        _highlightVerticalLineNode.style.opacity = 0;
    };
    // 构造轴网
    this.generateAxisGrid = function (recalculate) {
        if (recalculate == undefined) {
            recalculate = true;
        }
        var jsonObj = CLOUD.MiniMap.axisGridData;
        if (!jsonObj) return;
        var len = jsonObj.Grids.length;
        if (len < 1) {
            console.error("axis grid data error!!!");
            return;
        }
        _isLoadedAxisGrid = true;
        var grids;
        var mapMaxBox = jsonObj.mapMaxBox;
        if (recalculate && mapMaxBox) {
            grids = adjustAxisGrid(jsonObj.Grids, mapMaxBox);
        } else {
            grids = jsonObj.Grids;
        }
        this.axisGirds = grids;
        this.initAxisGird(grids);
        // 如果先初始化平面图，后初始化轴网，因为轴网确定范围，则需要重新初始化平面图
        if (_isLoadedFloorPlane) {
            console.log("re-initialize floor plane!!!");
            this.initFloorPlane();
            if (_isChangeView) {
                this.fly();
            } else {
                this.render();
            }
        } else {
            this.render();
        }
    };
    // 初始化轴网
    this.initAxisGird = function (grids) {
        
        // 计算轴网包围盒
        calculateAxisGridBox(grids);
        // 计算轴网交叉点
        calculateAxisGridIntersection(grids, _materialGrid);
    };
    //this.initAxisGirdLevels = function (levels) {
    //    var len = levels.length;
    //
    //    if (len < 1) {
    //        return;
    //    }
    //
    //    for (var i = 0; i < len; i++) {
    //        _axisGridLevels.push(levels[i]);
    //    }
    //};
    // 构造平面图
    this.generateFloorPlane = function (changeView) {
        if (changeView === undefined) {
            changeView = false;
        }
        _isChangeView = changeView;
        var jsonObj = CLOUD.MiniMap.floorPlaneData;
        if (!jsonObj) return;
        var url = jsonObj["Path"] || jsonObj["path"];
        var boundingBox = jsonObj["BoundingBox"] || jsonObj["boundingBox"];
        var elevation = jsonObj["Elevation"] || jsonObj["elevation"];
        if (!url || !boundingBox) {
            console.warn('floor-plan data is error!');
            return;
        }
        _floorPlaneUrl = url;
        _floorPlaneBox = new THREE.Box3(new THREE.Vector3(boundingBox.Min.X, boundingBox.Min.Y, boundingBox.Min.Z), new THREE.Vector3(boundingBox.Max.X, boundingBox.Max.Y, boundingBox.Max.Z));
        // 设置相机投影点位置高度在平面图包围盒中心
        _cameraProjectedPosZ = 0.5 * (_floorPlaneBox.min.z + _floorPlaneBox.max.z);
        _floorPlaneMinZ = elevation || _floorPlaneBox.min.z;
        _isLoadedFloorPlane = true;
        if (!_isLoadedAxisGrid) {
            console.warn('axis-grid is not initialized!');
            return;
        }
        this.initFloorPlane();
        // render
        if (_isChangeView) {
            this.fly();
        } else {
            this.render();
        }
    };
    // 初始化平面图
    this.initFloorPlane = function () {
        var url = _floorPlaneUrl;
        // 平面图不需要使用Z坐标
        var bBox2D = new THREE.Box2(new THREE.Vector2(_floorPlaneBox.min.x, _floorPlaneBox.min.y), new THREE.Vector2(_floorPlaneBox.max.x, _floorPlaneBox.max.y));
        // 计算位置
        var axisGridBoxSize = _axisGridBox2D.getSize();
        var axisGridCenter = _axisGridBox2D.getCenter();
        var boxSize = bBox2D.getSize();
        var boxCenter = bBox2D.getCenter();
        //var scaleX = _svgWidth / axisGridBoxSize.x;
        //var scaleY = _svgHeight / axisGridBoxSize.y;
        ////var scale = Math.min(scaleX, scaleY);
        //var scale = Math.max(scaleX, scaleY);
        // 保持比例
        var scale = _svgWidth / axisGridBoxSize.x;
        var width = boxSize.x * scale;
        var height = boxSize.y * scale;
        var offset = boxCenter.clone().sub(axisGridCenter);
        offset.x *= scale;
        offset.y *= -scale;
        if (!_axisGridBox2D.containsBox(bBox2D)) {
            console.warn('the bounding-box of axis-grid is not contains the bounding-box of floor-plane!');
        }
        _svgNode = getImageNode(0);
        _svgNode.href.baseVal = url;
        _svgNode.setAttribute("id", "Floor-" + _imageCount);
        _svgNode.setAttribute("preserveAspectRatio", "none");
        _svgNode.setAttribute("width", width + "");
        _svgNode.setAttribute("height", height + "");
        _svgNode.setAttribute("x", (-0.5 * width) + "");
        _svgNode.setAttribute("y", (-0.5 * height) + "");
        _svgNode.setAttribute("transform", 'translate(' + offset.x + ',' + offset.y + ')');
    };
    // 重设轴网大小
    this.resizeClientAxisGrid = function () {
        var grids = this.axisGirds || CLOUD.MiniMap.axisGridData.Grids;
        this.initAxisGird(grids);
        if (_isLoadedFloorPlane) {
            this.initFloorPlane();
        }
    };
    // 显示轴网
    this.showAxisGird = function () {
        if (_isLoadedAxisGrid) {
            _isShowAxisGrid = true;
            this.resizeClientAxisGrid();
            //_svgGroupForAxisGrid.style.opacity = 1;
            _svgGroupForAxisGrid.style.display = "";
            if (_hasHighlightInterPoint) {
                this.showTip();
            }
            this.render();
        }
    };
    // 隐藏轴网
    this.hideAxisGird = function () {
        if (_isLoadedAxisGrid) {
            _isShowAxisGrid = false;
            this.resizeClientAxisGrid();
            //_svgGroupForAxisGrid.style.opacity = 0;
            _svgGroupForAxisGrid.style.display = "none";
            this.hideTip();
            this.render();
        }
    };
    // 显示提示节点
    this.showTip = function () {
        if (_tipNode) {
            _tipNode.className = "cloud-tip";
            _tipNode.style.opacity = 1;
        }
        if (_circleNode) {
            _circleNode.style.opacity = 1;
        }
        if (_highlightHorizLineNode) {
            _highlightHorizLineNode.style.opacity = 1;
        }
        if (_highlightVerticalLineNode) {
            _highlightVerticalLineNode.style.opacity = 1;
        }
    };
    // 隐藏提示节点
    this.hideTip = function () {
        if (_tipNode) {
            _tipNode.className = "";
            _tipNode.style.opacity = 0;
        }
        if (_circleNode) {
            _circleNode.style.opacity = 0;
        }
        if (_highlightHorizLineNode) {
            _highlightHorizLineNode.style.opacity = 0;
        }
        if (_highlightVerticalLineNode) {
            _highlightVerticalLineNode.style.opacity = 0;
        }
    };
    // 通过轴网号高亮
    this.highlightNodeByAxisGridNumber = function (abcName, numeralName) {
        var intersection = this.getIntersectionByAxisGridNumber(abcName, numeralName);
        if (intersection) {
            this.setHighlightNode(intersection);
            this.showTip();
        } else {
            this.hideTip();
        }
        this.render();
    };
    // 高亮节点
    this.highlightedNode = function (isOverCanvas, isShowAxisGrid, allowNear) {
        _hasHighlightInterPoint = false;
        if (isOverCanvas && isShowAxisGrid) {
            var intersection;
            // 允许获得离选中的点最近的交点
            if (allowNear) {
                var screenPosition = normalizedMouse.clone();
                normalizedPointToScreen(screenPosition);
                // 获得最近的轴网交点
                intersection = this.getIntersectionToMinDistance(screenPosition);
            } else {
                intersection = this.getIntersectionByNormalizedPoint(normalizedMouse);
            }
            if (intersection) {
                _hasHighlightInterPoint = true;
                this.setHighlightNode(intersection);
                this.showTip();
            } else {
                this.hideTip();
            }
            this.render();
            if (this.callbackClickOnAxisGrid) {
                var gridInfo = this.getAxisGridInfoByNormalizedPoint(normalizedMouse);
                this.callbackClickOnAxisGrid(gridInfo);
            }
        } else {
            this.hideTip();
            this.render();
        }
    };
    // 设置节点高亮状态
    this.setHighlightNode = function (highlightNode) {
        
        // 高亮点的变换位置
        _circleNode.setAttribute('transform', 'translate(' + highlightNode.intersectionPoint.x + ',' + highlightNode.intersectionPoint.y + ')');
        // 提示文本
        _tipNode.innerHTML = highlightNode.numeralName + "-" + highlightNode.abcName;
        // 位置
        var box = _tipNode.getBoundingClientRect();
        _tipNode.style.left = (_svgHalfWidth + highlightNode.intersectionPoint.x - 0.5 * box.width) + "px";
        _tipNode.style.top = (_svgHalfHeight + highlightNode.intersectionPoint.y - box.height - 12) + "px"; // 12 = fontsize(10px) + 2 * linewidth(1px)
        // 水平线条
        _highlightHorizLineNode.setAttribute('x1', highlightNode.horizLine[0].x);
        _highlightHorizLineNode.setAttribute('y1', highlightNode.horizLine[0].y);
        _highlightHorizLineNode.setAttribute('x2', highlightNode.horizLine[1].x);
        _highlightHorizLineNode.setAttribute('y2', highlightNode.horizLine[1].y);
        // 垂直线条
        _highlightVerticalLineNode.setAttribute('x1', highlightNode.verticalLine[0].x);
        _highlightVerticalLineNode.setAttribute('y1', highlightNode.verticalLine[0].y);
        _highlightVerticalLineNode.setAttribute('x2', highlightNode.verticalLine[1].x);
        _highlightVerticalLineNode.setAttribute('y2', highlightNode.verticalLine[1].y);
    };
    // 获得主场景变换矩阵
    this.getMainSceneMatrix = function () {
        return this.viewer.getScene().getMatrixGlobal();
    };
    // 判断点是否在场景包围盒中
    this.containsPointInMainScene = function (point) {
        var boundingBox = this.viewer.getScene().getBoundingBoxWorld();
        if (boundingBox) {
            return boundingBox.containsPoint(point);
        }
        return false;
    };
    // 根据指定位置点获得轴网信息
    this.getAxisGridInfoByPoint = function (point) {
        
        //if (_isLoadedFloorPlane) {
        var sceneMatrix = this.getMainSceneMatrix();
        var inverseMatrix = new THREE.Matrix4();
        inverseMatrix.getInverse(sceneMatrix);
        // 点对应的世界坐标
        var pointWorldPosition = point.clone();
        pointWorldPosition.applyMatrix4(inverseMatrix);
        // 屏幕坐标
        var screenPosition = pointWorldPosition.clone();
        worldToNormalizedPoint(screenPosition);
        normalizedPointToScreen(screenPosition);
        // 获得最近的轴网交点
        var intersection = this.getIntersectionToMinDistance(screenPosition);
        if (intersection) {
            // 计算轴信息
            var interPoint = new THREE.Vector2(intersection.intersectionPoint.x, intersection.intersectionPoint.y);
            screenToNormalizedPoint(interPoint);
            normalizedPointToWorld(interPoint);
            var offsetX = Math.round(pointWorldPosition.x - interPoint.x);
            var offsetY = Math.round(pointWorldPosition.y - interPoint.y);
            return {
                position: pointWorldPosition,
                abcName: intersection.abcName,
                numeralName: intersection.numeralName,
                offsetX: offsetX,
                offsetY: offsetY
            }
        }
        //}
        return {
            position: new THREE.Vector3(),
            abcName: '',
            numeralName: '',
            offsetX: '',
            offsetY: ''
        };
    };
    // 根据规范化坐标点获得轴网信息
    this.getAxisGridInfoByNormalizedPoint = function (normalizedPoint) {
        
        //if (_isLoadedFloorPlane) {
        // 世界坐标
        var pointWorldPosition = normalizedPoint.clone();
        normalizedPointToWorld(pointWorldPosition);
        // 屏幕坐标
        var screenPosition = normalizedPoint.clone();
        normalizedPointToScreen(screenPosition);
        // 获得最近的轴网交点
        var intersection = this.getIntersectionToMinDistance(screenPosition);
        if (intersection) {
            // 计算轴信息
            var interPoint = new THREE.Vector2(intersection.intersectionPoint.x, intersection.intersectionPoint.y);
            screenToNormalizedPoint(interPoint);
            normalizedPointToWorld(interPoint);
            var offsetX = Math.round(pointWorldPosition.x - interPoint.x);
            var offsetY = Math.round(pointWorldPosition.y - interPoint.y);
            return {
                position: pointWorldPosition,
                abcName: intersection.abcName,
                numeralName: intersection.numeralName,
                offsetX: offsetX,
                offsetY: offsetY
            }
        }
        //}
        return {
            position: new THREE.Vector3(),
            abcName: '',
            numeralName: '',
            offsetX: '',
            offsetY: ''
        };
    };
    // 根据正规化坐标获得轴网交叉点
    this.getIntersectionByNormalizedPoint = function (normalizedPoint) {
        var intersection = null;
        var _circleRadiusToSquared = _circleNodeRadius * _circleNodeRadius;
        for (var i = 0, len = _axisGridIntersectionPoints.length; i < len; i++) {
            var interPoint = _axisGridIntersectionPoints[i].intersectionPoint;
            var point = new THREE.Vector2(normalizedPoint.x, normalizedPoint.y);
            normalizedPointToScreen(point);
            var distanceSquared = interPoint.distanceToSquared(point);
            if (distanceSquared < _circleRadiusToSquared) {
                intersection = _axisGridIntersectionPoints[i];
                break;
            }
        }
        return intersection;
    };
    // 根据轴网号获得轴网交叉点
    this.getIntersectionByAxisGridNumber = function (abcName, numeralName) {
        var intersection = null;
        for (var i = 0, len = _axisGridIntersectionPoints.length; i < len; i++) {
            var abcNameTmp = _axisGridIntersectionPoints[i].abcName.toLowerCase();
            var numeralNameTmp = _axisGridIntersectionPoints[i].numeralName;
            if (abcNameTmp === abcName.toLowerCase() && numeralNameTmp === numeralName) {
                intersection = _axisGridIntersectionPoints[i];
                break;
            }
        }
        return intersection;
    };
    // 获得离指定位置最近的交叉点
    this.getIntersectionToMinDistance = function (screenPosition) {
        if (_axisGridIntersectionPoints.length < 1) return null;
        var minDistanceSquared = 0;
        var idx = 0;
        for (var i = 0, len = _axisGridIntersectionPoints.length; i < len; i++) {
            var interObj = _axisGridIntersectionPoints[i];
            var interPoint = new THREE.Vector2(interObj.intersectionPoint.x, interObj.intersectionPoint.y);
            var distanceSquared = interPoint.distanceToSquared(screenPosition);
            if (i == 0) {
                minDistanceSquared = distanceSquared;
            } else {
                if (minDistanceSquared > distanceSquared) {
                    minDistanceSquared = distanceSquared;
                    idx = i;
                }
            }
        }
        return _axisGridIntersectionPoints[idx];
    };
    // 检查平面图包围盒，如果没有平面图，则使用场景包围盒
    this.checkFloorPlaneBox = function () {
        if (!_floorPlaneBox) {
            // 没有平面图的话，将平面图包围设置为场景包围盒
            _floorPlaneBox = this.viewer.getBoundingBoxWorld();
            // 设置相机投影点位置高度在平面图包围盒中心
            if (_floorPlaneBox) {
                _cameraProjectedPosZ = 0.5 * (_floorPlaneBox.min.z + _floorPlaneBox.max.z);
                _floorPlaneMinZ = _floorPlaneBox.min.z;
            }
        }
    };
    // 计算相机在小地图上的位置
    this.calculateCameraPosition = function () {
        
        // if (!_isLoadedFloorPlane) return;
        this.checkFloorPlaneBox();
        var camera = this.viewer.camera;
        var cameraEditor = this.viewer.cameraControl;
        if (!camera || !cameraEditor) return;
        var cameraPosition = camera.position;
        var cameraTargetPosition = camera.target;
        var sceneMatrix = this.getMainSceneMatrix();
        var inverseMatrix = new THREE.Matrix4();
        inverseMatrix.getInverse(sceneMatrix);
        var bBoxCenter = _floorPlaneBox.getCenter();
        var pointA = new THREE.Vector3(_floorPlaneBox.min.x, _floorPlaneBox.min.y, bBoxCenter.z).applyMatrix4(sceneMatrix);
        var pointB = new THREE.Vector3(_floorPlaneBox.min.x, _floorPlaneBox.max.y, bBoxCenter.z).applyMatrix4(sceneMatrix);
        var pointC = new THREE.Vector3(_floorPlaneBox.max.x, _floorPlaneBox.min.y, bBoxCenter.z).applyMatrix4(sceneMatrix);
        var plane = new THREE.Plane();
        plane.setFromCoplanarPoints(pointA, pointB, pointC);
        // 计算相机投影
        var projectedCameraPosition = plane.projectPoint(cameraPosition);
        // 相机投影点世界坐标
        projectedCameraPosition.applyMatrix4(inverseMatrix);
        // 计算相机LookAt投影
        var projectedTargetPosition = plane.projectPoint(cameraTargetPosition);
        // 相机LookAt投影点世界坐标
        projectedTargetPosition.applyMatrix4(inverseMatrix);
        // 计算相机投影后的方向
        var projectedEye = projectedTargetPosition.clone().sub(projectedCameraPosition);
        projectedEye.z = 0;
        projectedEye.normalize();
        // 计算相机世界位置
        var cameraWorldPosition = cameraPosition.clone();
        cameraWorldPosition.applyMatrix4(inverseMatrix);
        // 相机屏幕坐标
        var cameraScreenPosition = cameraWorldPosition.clone();
        worldToNormalizedPoint(cameraScreenPosition);
        normalizedPointToScreen(cameraScreenPosition);
        _cameraNode.setAttribute('opacity', '1.0');
        if (projectedEye.length() < _epsilon) {
            
            // 隐藏箭头方向
            _cameraArrowNode.setAttribute('opacity', '0.0');
            _cameraNode.setAttribute("transform", "translate(" + cameraScreenPosition.x + "," + cameraScreenPosition.y + ")");
        } else {
            
            // 计算角度
            var up = new THREE.Vector3(0, 0, 1);
            var axisX = new THREE.Vector3(1, 0, 0);
            var isGreaterThanPi = isAngleGreaterThanPi(axisX, projectedEye, up);
            // [0, PI]
            var angle = THREE.Math.radToDeg(axisX.angleTo(projectedEye));
            // 注意：svg顺时针时针为正
            if (!isGreaterThanPi) {
                angle *= -1;
            }
            // 计算边缘交点
            var newProjectedCameraPosition = this.calculateEdgePositionCameraOutBounds(_axisGridBox2D, projectedCameraPosition, projectedEye);
            if (newProjectedCameraPosition) {
                var newCameraScreenPosition = new THREE.Vector2(newProjectedCameraPosition.x, newProjectedCameraPosition.y);
                worldToNormalizedPoint(newCameraScreenPosition);
                normalizedPointToScreen(newCameraScreenPosition);
                _cameraArrowNode.setAttribute('opacity', '1.0');
                _cameraCircleNode.setAttribute('opacity', '0.0');
                _cameraNode.setAttribute("transform", "translate(" + newCameraScreenPosition.x + "," + newCameraScreenPosition.y + ") rotate(" + angle + ")");
            } else {
                _cameraArrowNode.setAttribute('opacity', '1.0');
                _cameraCircleNode.setAttribute('opacity', '1.0');
                _cameraNode.setAttribute("transform", "translate(" + cameraScreenPosition.x + "," + cameraScreenPosition.y + ") rotate(" + angle + ")");
            }
        }
        // 设置回调相机信息
        this.setCallbackCameraInfo(cameraWorldPosition, cameraScreenPosition);
        _lastCameraWorldPosition = cameraWorldPosition.clone();
        var cameraProjectedWorldPosition = new THREE.Vector3(projectedCameraPosition.x, projectedCameraPosition.y, _cameraProjectedPosZ);
        return {
            worldPosition: cameraWorldPosition,
            projectedWorldPosition: cameraProjectedWorldPosition,
            screenPosition: cameraScreenPosition
        }
    };
    // 计算相机在边界上的位置
    this.calculateEdgePositionCameraOutBounds = function (bBox, worldPosition, direction) {
        
        // 先计算射线与Y轴平行的两个面的交点，再计算射线与X轴平行的两个面的交点
        var isExistedPoint = function (points, p) {
            var existEqual = false;
            for (var i = 0, len = points.length; i < len; i++) {
                if (CLOUD.Extensions.Utils.Geometric.isEqualBetweenPoints(p, points[i], _epsilon)) {
                    existEqual = true;
                    break;
                }
            }
            return existEqual;
        };
        // 将包围盒上下左右拉大0.5，预防浮点精度问题
        var extendBox = bBox.clone();
        extendBox.min.x -= 0.5;
        extendBox.min.y -= 0.5;
        extendBox.max.x += 0.5;
        extendBox.max.y += 0.5;
        // 判断点是否在包围盒中，不在则计算与边缘的交点
        if (!extendBox.containsPoint(worldPosition)) {
            var intersects = [];
            var origin = new THREE.Vector3(worldPosition.x, worldPosition.y, 0);
            var ray = new THREE.Ray(origin, direction);
            // 与Y轴平行的面
            var point = new THREE.Vector3(bBox.min.x, bBox.min.y, 0);
            var normal = new THREE.Vector3(-1, 0, 0);
            var plane = new THREE.Plane();
            plane.setFromNormalAndCoplanarPoint(normal, point);
            var intersect = ray.intersectPlane(plane);
            if (intersect && extendBox.containsPoint(intersect)) {
                intersects.push(intersect);
            }
            // 与Y轴平行的面
            point.set(bBox.max.x, bBox.max.y, 0);
            normal.set(-1, 0, 0);
            plane.setFromNormalAndCoplanarPoint(normal, point);
            intersect = ray.intersectPlane(plane);
            if (intersect && extendBox.containsPoint(intersect)) {
                intersects.push(intersect);
            }
            // 与X轴平行的面
            point.set(bBox.min.x, bBox.min.y, 0);
            normal.set(0, 1, 0);
            plane.setFromNormalAndCoplanarPoint(normal, point);
            intersect = ray.intersectPlane(plane);
            if (intersect && extendBox.containsPoint(intersect)) {
                
                // 判断是否存在同一个点（四个角的位置可能出现同点）
                if (!isExistedPoint(intersect, intersects)) {
                    intersects.push(intersect);
                }
            }
            // 与X轴平行的面
            point.set(bBox.max.x, bBox.max.y, 0);
            normal.set(0, 1, 0);
            plane.setFromNormalAndCoplanarPoint(normal, point);
            intersect = ray.intersectPlane(plane);
            if (intersect && extendBox.containsPoint(intersect)) {
                
                // 判断是否存在同一个点（四个角的位置可能出现同点）
                if (!isExistedPoint(intersect, intersects)) {
                    intersects.push(intersect);
                }
            }
            if (intersects.length != 2) {
                return null;
            }
            // 存在两个交点则射线与包围盒相交
            var inter1 = intersects[0];
            var inter2 = intersects[1];
            var dir = inter2.clone().sub(inter1).normalize();
            if (CLOUD.Extensions.Utils.Geometric.isEqualBetweenPoints(dir, direction, _epsilon)) {
                return intersects[0];
            } else {
                return intersects[1];
            }
        }
        return null;
    };
    // 定位
    this.fly = function () {
        var cameraPosition = this.calculateCameraPosition();
        var cameraProjectedWorldPosition = cameraPosition.projectedWorldPosition.clone();
        // 变换到缩放后的场景区域
        transformWorldPoint(cameraProjectedWorldPosition);
        this.flyToPointWithParallelEye(cameraProjectedWorldPosition);
    };
    // 根据给定世界系中的点以平行视线方向定位
    this.flyToPointWithParallelEye = function (wPoint) {
        this.viewer.cameraControlcameraControl.flyToPointWithParallelEye(wPoint);
    };
    // 根据轴号定位
    this.flyByAxisGridNumber = function (abcName, numeralName) {
        
        // 获得最近的交点
        var intersection = this.getIntersectionByAxisGridNumber(abcName, numeralName);
        if (intersection) {
            this.checkFloorPlaneBox();
            var interPoint = new THREE.Vector3(intersection.intersectionPoint.x, intersection.intersectionPoint.y, _cameraProjectedPosZ);
            screenToNormalizedPoint(interPoint);
            normalizedPointToWorld(interPoint);
            transformWorldPoint(interPoint);
            this.viewer.cameraControl.flyToPointWithParallelEye(interPoint);
            return true;
        }
        return false;
    };
    // 返回相机信息
    this.setCallbackCameraInfo = function (worldPosition, screenPosition) {
        var posChanged = true;
        if (_lastCameraWorldPosition) {
            posChanged = (worldPosition.distanceToSquared(_lastCameraWorldPosition) !== 0);
        }
        if (this.callbackCameraChanged && posChanged) {
            var cameraWorldPos = worldPosition.clone();
            // 获得离相机最近的交点
            var intersection = this.getIntersectionToMinDistance(screenPosition);
            if (intersection) {
                // 计算轴信息
                var interPoint = new THREE.Vector2(intersection.intersectionPoint.x, intersection.intersectionPoint.y);
                screenToNormalizedPoint(interPoint);
                normalizedPointToWorld(interPoint);
                var offsetX = Math.round(worldPosition.x - interPoint.x);
                var offsetY = Math.round(worldPosition.y - interPoint.y);
                var offsetZ = Math.round(worldPosition.z - _floorPlaneMinZ);
                var axisInfoX = "X(" + intersection.numeralName + "," + offsetX + ")";
                var axisInfoY = "Y(" + intersection.abcName + "," + offsetY + ")";
                var isInScene = true;
                var projectedWorldPosition = worldPosition.clone();
                projectedWorldPosition.setZ(_cameraProjectedPosZ);
                // 判断是否在场景包围盒里面
                if (!this.containsPointInMainScene(projectedWorldPosition)) {
                    isInScene = false;
                    axisInfoX = "";
                    axisInfoY = "";
                }
                var jsonObj = {
                    position: cameraWorldPos,
                    isInScene: isInScene,
                    axis: {
                        abcName: intersection.abcName,
                        numeralName: intersection.numeralName,
                        offsetX: offsetX,
                        offsetY: offsetY,
                        offsetZ: offsetZ,
                        infoX: axisInfoX,
                        infoY: axisInfoY
                    }
                };
                this.callbackCameraChanged(jsonObj);
            } else {
                var jsonObj = {
                    position: cameraWorldPos,
                    isInScene: false,
                    axis: {
                        abcName: '',
                        numeralName: '',
                        offsetX: '',
                        offsetY: '',
                        offsetZ: '',
                        infoX: '',
                        infoY: ''
                    }
                };
                this.callbackCameraChanged(jsonObj);
            }
        }
    };
    // 启用或禁用相机图标
    this.enableCameraNode = function (enable) {
        _enableShowCamera = enable;
        //this.render();
    };
    // 从主容器中移除小地图
    this.remove = function () {
        if (_mapContainer && _mapContainer.parentNode) {
            _mapContainer.parentNode.removeChild(_mapContainer);
        }
    };
    // 增加小地图到主容器
    this.append = function () {
        if (_mapContainer && !_mapContainer.parentNode) {
            this.domContainer.appendChild(_mapContainer);
            this.render();
        }
    };
    // 相机变化回调
    this.setCameraChangedCallback = function (callback) {
        this.callbackCameraChanged = callback;
    };
    // 轴网上点击回调
    this.setClickOnAxisGridCallback = function (callback) {
        this.callbackClickOnAxisGrid = callback;
    };
    this.resize = function (width, height) {
        if (_mapContainer && _isLoadedAxisGrid) {
            // 设置绘图面板大小
            this.setSize(width, height);
            this.resizeClientAxisGrid();
            if (_isShowAxisGrid) {
                _svgGroupForAxisGrid.style.display = "";
            } else {
                _svgGroupForAxisGrid.style.display = "none";
            }
            this.hideTip();
            this.render();
        }
    }
};
CLOUD.MiniMap.axisGridData = null;
CLOUD.MiniMap.floorPlaneData = null;
CLOUD.MiniMap.setAxisGridData = function (jsonObj) {
    CLOUD.MiniMap.axisGridData = jsonObj;
};
CLOUD.MiniMap.setFloorPlaneData = function (jsonObj) {
    CLOUD.MiniMap.floorPlaneData = jsonObj;
};
CLOUD.Extensions.Marker = function (id, editor) {
    this.id = id;
    this.editor = editor;
    this.position = new THREE.Vector3();
    this.boundingBox = new THREE.Box3();
    this.shape = null;
    this.style = CLOUD.Extensions.Marker.getDefaultStyle();
    this.selected = false;
    this.highlighted = false;
    this.highlightColor = '#000088';
    this.isDisableInteractions = false;
    this.keys = {
        BACKSPACE: 8,
        ALT: 18,
        ESC: 27,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        BOTTOM: 40,
        DELETE: 46,
        ZERO: 48,
        A: 65,
        D: 68,
        E: 69,
        Q: 81,
        S: 83,
        W: 87,
        PLUS: 187,
        SUB: 189
    };
    this.onMouseDownBinded = this.onMouseDown.bind(this);
    this.onKeyUpBinded = this.onKeyUp.bind(this);
};
CLOUD.Extensions.Marker.prototype = {
    constructor: CLOUD.Extensions.Marker,
    addDomEventListeners: function () {
        this.shape.addEventListener("mousedown", this.onMouseDownBinded, true);
        window.addEventListener("keyup", this.onKeyUpBinded);
    },
    removeDomEventListeners: function () {
        this.shape.removeEventListener("mousedown", this.onMouseDownBinded, true);
        window.removeEventListener("keyup", this.onKeyUpBinded);
    },
    onMouseDown: function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.select();
    },
    onKeyUp: function (event) {
        switch (event.keyCode) {
            case this.keys.DELETE:
                this.editor.deselectMarker();
                this.delete();
                break;
            default :
                break;
        }
    },
    createShape: function () {
    },
    destroy: function () {
        this.removeDomEventListeners();
        this.deselect();
        this.setParent(null);
    },
    set: function (userId, position, boundingBox, style) {
        this.userId = userId;
        this.position.set(position.x, position.y, position.z);
        this.boundingBox = boundingBox.clone();
        if (style) {
            this.style = CLOUD.DomUtil.cloneStyle(style);
        }
        this.update();
    },
    setParent: function (parent) {
        var shapeEl = this.shape;
        if (shapeEl) {
            if (shapeEl.parentNode) {
                shapeEl.parentNode.removeChild(shapeEl);
            }
            if (parent) {
                parent.appendChild(shapeEl);
            }
        }
    },
    setStyle: function (style) {
        this.style = CLOUD.DomUtil.cloneStyle(style);
        this.update();
    },
    select: function () {
        
        //if (this.selected) {
        //    return;
        //}
        //
        //this.selected = true;
        //this.highlighted = false;
        //this.update();
        //this.editor.selectMarker(this);
        if (!this.selected) {
            this.selected = true;
            this.highlight(true);
        }
        this.editor.selectMarker(this);
    },
    deselect: function () {
        this.highlight(false);
        this.selected = false;
    },
    highlight: function (isHighlight) {
        if (this.isDisableInteractions) {
            return;
        }
        this.highlighted = isHighlight;
        this.update();
    },
    disableInteractions: function (disable) {
        this.isDisableInteractions = disable;
    },
    delete: function () {
        this.editor.deleteMarker(this);
    },
    getClientPosition: function () {
        return this.editor.worldToClient(this.position);
    },
    getBoundingBox: function () {
        return this.boundingBox;
    },
    toNewObject: function () {
        return {
            id: this.id,
            userId: this.userId,
            shapeType: this.shapeType,
            position: this.position ? this.position.clone() : null,
            boundingBox: this.boundingBox ? this.boundingBox.clone() : null
        };
    },
    update: function () {
        var strokeWidth = this.style['stroke-width'];
        var strokeColor = this.highlighted ? this.highlightColor : this.style['stroke-color'];
        var strokeOpacity = this.style['stroke-opacity'];
        var fillColor = this.style['fill-color'];
        var fillOpacity = this.style['fill-opacity'];
        var position = this.getClientPosition();
        if (!position) {
            this.shape.style.display = "none";
            return;
        }
        if (this.shape.style.display !== '') {
            this.shape.style.display = '';
        }
        var offsetX = position.x;
        var offsetY = position.y;
        var transformShape = [
            'translate(', offsetX, ',', offsetY, ') '
        ].join('');
        this.shape.setAttribute("transform", transformShape);
        this.shape.setAttribute("stroke-width", strokeWidth);
        this.shape.setAttribute("stroke", strokeColor);
        this.shape.setAttribute("stroke-opacity", strokeOpacity);
        this.shape.setAttribute('fill', fillColor);
        this.shape.setAttribute('fill-opacity', fillOpacity);
    }
};
CLOUD.Extensions.Marker.shapeTypes = {BUBBLE: 0, FLAG: 1, COMMON: 2};
CLOUD.Extensions.Marker.getDefaultStyle = function () {
    var style = {};
    style['stroke-width'] = 2;
    style['stroke-color'] = '#fffaff';
    style['stroke-opacity'] = 1.0;
    style['fill-color'] = '#ff2129';
    style['fill-opacity'] = 1.0;
    return style;
};
CLOUD.Extensions.MarkerFlag = function (id, editor) {
    CLOUD.Extensions.Marker.call(this, id, editor);
    this.shapeType = CLOUD.Extensions.Marker.shapeTypes.FLAG;
    this.createShape();
    this.addDomEventListeners();
};
CLOUD.Extensions.MarkerFlag.prototype = Object.create(CLOUD.Extensions.Marker.prototype);
CLOUD.Extensions.MarkerFlag.prototype.constructor = CLOUD.Extensions.Marker;
CLOUD.Extensions.MarkerFlag.prototype.createShape = function () {
    this.shape = CLOUD.Extensions.Utils.Shape2D.makeFlag();
};
CLOUD.Extensions.MarkerBubble = function (id, editor) {
    CLOUD.Extensions.Marker.call(this, id, editor);
    this.shapeType = CLOUD.Extensions.Marker.shapeTypes.BUBBLE;
    this.createShape();
    this.addDomEventListeners();
};
CLOUD.Extensions.MarkerBubble.prototype = Object.create(CLOUD.Extensions.Marker.prototype);
CLOUD.Extensions.MarkerBubble.prototype.constructor = CLOUD.Extensions.Marker;
CLOUD.Extensions.MarkerBubble.prototype.createShape = function () {
    this.shape = CLOUD.Extensions.Utils.Shape2D.makeBubble();
};
CLOUD.Extensions.MarkerEditor = function (viewer) {
    "use strict";
    this.cameraEditor = viewer.cameraControl;
    this.scene = viewer.getScene();
    this.domElement = viewer.domElement;
    this.markers = [];
    this.selectedMarker = null;
    // 隐患待整改：红色
    // 隐患已整改：黄色
    // 隐患已关闭：绿色
    // size: 15 * 20
    this.flagColors = {red: "#ff2129", green: "#85af03", yellow: "#fe9829"};
    // 有隐患：红色
    // 无隐患：绿色
    // 过程验收点、开业验收点的未检出：灰色 --> 橙色
    // size: 14 * 20
    this.bubbleColors = {red: "#f92a24", green: "#86b507", gray: "#ff9326"};
    this.nextMarkerId = 0;
    this.initialized = false;
    this.markerClickCallback = null;
};
CLOUD.Extensions.MarkerEditor.prototype.onResize = function () {
    if (!this.svg) return;
    var bounds = this.getDomContainerBounds();
    this.svg.setAttribute('width', bounds.width + '');
    this.svg.setAttribute('height', bounds.height + '');
    this.updateMarkers();
};
CLOUD.Extensions.MarkerEditor.prototype.init = function () {
    if (!this.svg) {
        var bounds = this.getDomContainerBounds();
        var svgWidth = bounds.width;
        var svgHeight = bounds.height;
        this.svg = CLOUD.Extensions.Utils.Shape2D.createSvgElement('svg');
        this.svg.style.position = "absolute";
        this.svg.style.display = "block";
        this.svg.style.position = "absolute";
        this.svg.style.display = "block";
        this.svg.style.left = "0";
        this.svg.style.top = "0";
        this.svg.setAttribute('width', svgWidth + '');
        this.svg.setAttribute('height', svgHeight + '');
        this.domElement.appendChild(this.svg);
        //this.enableSVGPaint(false);
        this.svgGroup = CLOUD.Extensions.Utils.Shape2D.createSvgElement('g');
        this.svg.insertBefore(this.svgGroup, this.svg.firstChild);
    }
    this.initialized = true;
};
CLOUD.Extensions.MarkerEditor.prototype.uninit = function () {
    this.initialized = false;
    if (!this.svg) return;
    // 卸载数据
    this.unloadMarkers();
    if (this.svgGroup && this.svgGroup.parentNode) {
        this.svgGroup.parentNode.removeChild(this.svgGroup);
    }
    if (this.svg.parentNode) {
        this.svg.parentNode.removeChild(this.svg);
    }
    this.svgGroup = null;
    this.svg = null;
    this.markerClickCallback = null;
};
CLOUD.Extensions.MarkerEditor.prototype.isInitialized = function () {
    return this.initialized;
};
// 生成标识ID
CLOUD.Extensions.MarkerEditor.prototype.generateMarkerId = function () {
    ++this.nextMarkerId;
    var id = this.nextMarkerId.toString(10);
    //var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    //    return v.toString(16);
    //});
    return id;
};
// 清除数据
CLOUD.Extensions.MarkerEditor.prototype.clear = function () {
    var markers = this.markers;
    while (markers.length) {
        var marker = markers[0];
        this.deleteMarker(marker);
    }
    var group = this.svgGroup;
    if (group && group.childNodes.length > 0) {
        while (group.childNodes.length) {
            group.removeChild(group.childNodes[0]);
        }
    }
};
// 增加
CLOUD.Extensions.MarkerEditor.prototype.addMarker = function (marker) {
    marker.setParent(this.svgGroup);
    this.markers.push(marker);
};
// 删除
CLOUD.Extensions.MarkerEditor.prototype.deleteMarker = function (marker) {
    if (marker) {
        var idx = this.markers.indexOf(marker);
        if (idx !== -1) {
            this.markers.splice(idx, 1);
        }
        marker.destroy();
    }
};
// 选中
CLOUD.Extensions.MarkerEditor.prototype.selectMarker = function (marker) {
    if (this.selectedMarker !== marker) {
        this.deselectMarker();
        this.selectedMarker = marker;
    } else {
        
        // 取消选择
        this.deselectMarker();
    }
    // click 回调
    if (this.markerClickCallback) {
        if (this.selectedMarker) {
            this.markerClickCallback(this.selectedMarker.toNewObject());
        } else {
            this.markerClickCallback(null);
        }
    }
};
// 取消选中
CLOUD.Extensions.MarkerEditor.prototype.deselectMarker = function () {
    if (this.selectedMarker) {
        this.selectedMarker.deselect();
        this.selectedMarker = null;
    }
};
// 获得主场景构件根节点变换矩阵
CLOUD.Extensions.MarkerEditor.prototype.getSceneMatrix = function () {
    return this.scene.getMatrixGlobal();
};
// 获得主场景构件根节点变换矩阵的逆
CLOUD.Extensions.MarkerEditor.prototype.getInverseSceneMatrix = function () {
    var sceneMatrix = this.getSceneMatrix();
    var inverseMatrix = new THREE.Matrix4();
    inverseMatrix.getInverse(sceneMatrix);
    return inverseMatrix;
};
// 世界坐标转屏幕坐标
CLOUD.Extensions.MarkerEditor.prototype.worldToClient = function (wPoint) {
    var bounds = this.getDomContainerBounds();
    var camera = this.cameraControl.camera;
    var sceneMatrix = this.getSceneMatrix();
    var result = new THREE.Vector3(wPoint.x, wPoint.y, wPoint.z);
    result.applyMatrix4(sceneMatrix);
    result.project(camera);
    // 裁剪不在相机范围的值
    if (Math.abs(result.z) > 1) {
        return null;
    }
    result.x = Math.round(0.5 * (result.x + 1) * bounds.width);
    result.y = Math.round(-0.5 * (result.y - 1) * bounds.height);
    result.z = 0;
    return result;
};
// 屏幕坐标转世界坐标
CLOUD.Extensions.MarkerEditor.prototype.clientToWorld = function (cPoint) {
    var bounds = this.getDomContainerBounds();
    var camera = this.cameraControl.camera;
    var result = new THREE.Vector3();
    result.x = cPoint.x / bounds.width * 2 - 1;
    result.y = -cPoint.y / bounds.height * 2 + 1;
    result.z = 0;
    result.unproject(camera);
    var inverseMatrix = this.getInverseSceneMatrix();
    result.applyMatrix4(inverseMatrix);
    return result;
};
// 屏幕坐标转规范化坐标
CLOUD.Extensions.MarkerEditor.prototype.clientToViewport = function (cPoint) {
    var bounds = this.getDomContainerBounds();
    var result = new THREE.Vector3();
    result.x = cPoint.x / bounds.width * 2 - 1;
    result.y = -cPoint.y / bounds.height * 2 + 1;
    result.z = 0;
    return result;
};
// 是否允许在SVG上绘图
CLOUD.Extensions.MarkerEditor.prototype.enableSVGPaint = function (enable) {
    if (enable) {
        this.svg && this.svg.setAttribute("pointer-events", "painted");
    } else {
        this.svg && this.svg.setAttribute("pointer-events", "none");
    }
};
// 获得容器边框
CLOUD.Extensions.MarkerEditor.prototype.getDomContainerBounds = function () {
    return CLOUD.DomUtil.getContainerOffsetToClient(this.domElement);
};
// 根据形状和状态获得颜色
CLOUD.Extensions.MarkerEditor.prototype.getMarkerColor = function (shape, state) {
    var markerColor = this.bubbleColors.red;
    if (shape < 0 && shape > 1) {
        shape = 0;
    }
    // 兼容以前的模式（0 - 5）
    if (state > 2) {
        state -= 3;
    }
    if (state < 0 && state > 2) {
        state = 0;
    }
    switch (state) {
        case 0:
            if (shape === 0) {
                markerColor = this.bubbleColors.red;
            } else {
                markerColor = this.flagColors.red;
            }
            break;
        case 1:
            if (shape === 0) {
                markerColor = this.bubbleColors.green;
            } else {
                markerColor = this.flagColors.green;
            }
            break;
        case 2:
            if (shape === 0) {
                markerColor = this.bubbleColors.gray;
            } else {
                markerColor = this.flagColors.yellow;
            }
            break;
    }
    return markerColor;
};
// 根据Pick对象信息创建标记
CLOUD.Extensions.MarkerEditor.prototype.createMarkerByIntersect = function (intersect, shapeType, state) {
    var id = this.generateMarkerId();//intersect.userId;
    var userId = intersect.userId;
    var position = intersect.worldPosition || intersect.object.point;
    var boundingBox = intersect.worldBoundingBox || intersect.object.boundingBox;
    var markerInfo = {
        id: id,
        userId: userId,
        position: position,
        boundingBox: boundingBox,
        shapeType: shapeType,
        state: state
    };
    this.createMarker(markerInfo);
};
// 创建标记
CLOUD.Extensions.MarkerEditor.prototype.createMarker = function (markerInfo) {
    if (!markerInfo) return;
    var style = CLOUD.Extensions.Marker.getDefaultStyle();
    style['fill-color'] = this.getMarkerColor(markerInfo.shapeType, markerInfo.state);
    var markerId = markerInfo.id;   //this.generateMarkerId();
    var marker;
    if (CLOUD.Extensions.Marker.shapeTypes.BUBBLE === markerInfo.shapeType) {
        marker = new CLOUD.Extensions.MarkerBubble(markerId, this);
    } else if (CLOUD.Extensions.Marker.shapeTypes.FLAG === markerInfo.shapeType) {
        marker = new CLOUD.Extensions.MarkerFlag(markerId, this);
    }
    else {
        marker = new CLOUD.Extensions.MarkerCommon(markerId, this, markerInfo.state);
    }
    marker.set(markerInfo.userId, markerInfo.position, markerInfo.boundingBox, style);
    this.addMarker(marker);
};
// ---------------------------- 外部 API BEGIN ---------------------------- //
// 获得所有marker的包围盒
CLOUD.Extensions.MarkerEditor.prototype.getMarkersBoundingBox = function () {
    if (this.markers.length < 1) return null;
    var bBox = new THREE.Box3();
    for (var i = 0, len = this.markers.length; i < len; i++) {
        var marker = this.markers[i];
        bBox.union(marker.getBoundingBox());
    }
    return bBox;
};
// 获得marker列表
CLOUD.Extensions.MarkerEditor.prototype.getMarkerInfoList = function () {
    var markerInfoList = [];
    for (var i = 0, len = this.markers.length; i < len; i++) {
        var marker = this.markers[i];
        var tmpId = marker.userId + "_" + i;
        var info = {
            id: marker.id || tmpId,
            userId: marker.userId,
            shapeType: marker.shapeType,
            position: marker.position,
            boundingBox: marker.boundingBox,
            state: marker.state
        };
        markerInfoList.push(info);
    }
    return markerInfoList;
};
// 加载
CLOUD.Extensions.MarkerEditor.prototype.loadMarkers = function (markers) {
    
    // 清除数据
    this.clear();
    for (var i = 0, len = markers.length; i < len; i++) {
        var info = markers[i];
        var tmpId = info.userId + "_" + i;
        var id = info.id || tmpId;
        var userId = info.userId;
        var shapeType = info.shapeType;
        var state = info.state;
        var position = info.position;
        var boundingBox = new THREE.Box3();
        boundingBox.max.x = info.boundingBox.max.x;
        boundingBox.max.y = info.boundingBox.max.y;
        boundingBox.max.z = info.boundingBox.max.z;
        boundingBox.min.x = info.boundingBox.min.x;
        boundingBox.min.y = info.boundingBox.min.y;
        boundingBox.min.z = info.boundingBox.min.z;
        var markerInfo = {
            id: id,
            userId: userId,
            position: position,
            boundingBox: boundingBox,
            shapeType: shapeType,
            state: state
        };
        this.createMarker(markerInfo);
    }
};
// 根据Pick对象信息加载
CLOUD.Extensions.MarkerEditor.prototype.loadMarkersFromIntersect = function (intersect, shapeType, state) {
    
    // 清除数据
    this.clear();
    this.createMarkerByIntersect(intersect, shapeType, state);
};
// 卸载
CLOUD.Extensions.MarkerEditor.prototype.unloadMarkers = function () {
    
    // 清除数据
    this.clear();
};
// 更新所有
CLOUD.Extensions.MarkerEditor.prototype.updateMarkers = function () {
    for (var i = 0, len = this.markers.length; i < len; i++) {
        var marker = this.markers[i];
        marker.update();
    }
};
//// 显示
//CLOUD.Extensions.MarkerEditor.prototype.showMarkers = function () {
//
//    if (this.svgGroup) {
//        this.svgGroup.setAttribute("visibility", "visible");
//    }
//};
//
//// 隐藏
//CLOUD.Extensions.MarkerEditor.prototype.hideMarkers = function () {
//
//    if (this.svgGroup) {
//        this.svgGroup.setAttribute("visibility", "hidden");
//    }
//};
// 根据ID获得marker
CLOUD.Extensions.MarkerEditor.prototype.getMarker = function (id) {
    var markers = this.markers;
    var count = markers.length;
    for (var i = 0; i < count; ++i) {
        if (markers[i].id == id) {
            return markers[i];
        }
    }
    return null;
};
// 设置marker选中回调
CLOUD.Extensions.MarkerEditor.prototype.setMarkerClickCallback = function (callback) {
    this.markerClickCallback = callback;
};
// ---------------------------- 外部 API END ---------------------------- //
CLOUD.Extensions.Annotation = function (editor, id) {
    this.editor = editor;
    this.id = id;
    this.shapeType = 0;
    this.position = {x: 0, y: 0, z: 0};
    this.size = {width: 0, height: 0};
    this.rotation = 0;
    this.style = editor.annotationStyle ? CLOUD.DomUtil.cloneStyle(editor.annotationStyle) : this.getDefaultStyle();
    this.shape = null;
    this.selected = false;
    this.highlighted = false;
    this.highlightColor = '#FAFF3C';
    this.isDisableInteractions = false;
    this.disableResizeWidth = false;
    this.disableResizeHeight = false;
    this.disableRotation = false;
    this.onMouseDownBinded = this.onMouseDown.bind(this);
    this.onMouseOutBinded = this.onMouseOut.bind(this);
    this.onMouseOverBinded = this.onMouseOver.bind(this);
};
CLOUD.Extensions.Annotation.prototype = {
    constructor: CLOUD.Extensions.Annotation,
    addDomEventListeners: function () {
    },
    removeDomEventListeners: function () {
    },
    onMouseDown: function (event) {
        if (this.isDisableInteractions) {
            return;
        }
        this.select();
        if (this.editor.annotationFrame) {
            this.editor.annotationFrame.dragBegin(event);
        }
    },
    onMouseOut: function () {
        this.highlight(false);
    },
    onMouseOver: function () {
        this.highlight(true);
    },
    created: function () {
    },
    destroy: function () {
        this.removeDomEventListeners();
        this.deselect();
        this.setParent(null);
    },
    set: function (position, size, rotation) {
        this.position.x = position.x;
        this.position.y = position.y;
        this.position.z = position.z;
        this.size.width = size.width;
        this.size.height = size.height;
        this.rotation = rotation || 0;
        this.update();
    },
    // 设置旋转角（弧度）
    resetRotation: function (angle) {
        this.rotation = angle;
        this.update();
    },
    // 获得旋转角（弧度）
    getRotation: function () {
        return this.rotation;
    },
    // 设置位置
    resetPosition: function (position) {
        this.position.x = position.x;
        this.position.y = position.y;
        this.position.z = position.z;
        this.update();
    },
    getClientPosition: function () {
        return this.editor.getAnnotationClientPosition(this.position);
    },
    resetSize: function (size, position) {
        this.size.width = size.width;
        this.size.height = size.height;
        this.position.x = position.x;
        this.position.y = position.y;
        this.position.z = position.z;
        this.update();
    },
    getClientSize: function () {
        return this.editor.getAnnotationClientSize(this.size, this.position);
    },
    setParent: function (parent) {
        var shapeEl = this.shape;
        if (shapeEl.parentNode) {
            shapeEl.parentNode.removeChild(shapeEl);
        }
        if (parent) {
            parent.appendChild(shapeEl);
        }
    },
    setStyle: function (style) {
        this.style = CLOUD.DomUtil.cloneStyle(style);
        // 文本批注需要传入一个强制更新的参数
        this.update(true);
    },
    getStyle: function () {
        return CLOUD.DomUtil.cloneStyle(this.style);
    },
    updateStyle: function (style) {
        this.style = CLOUD.DomUtil.cloneStyle(style);
        // 文本批注需要传入一个强制更新的参数
        this.update(true);
    },
    update: function () {
    },
    select: function () {
        if (this.selected) {
            return;
        }
        this.selected = true;
        this.highlighted = false;
        this.update();
        this.editor.selectAnnotation(this);
    },
    deselect: function () {
        this.selected = false;
    },
    highlight: function (isHighlight) {
        if (this.isDisableInteractions) {
            return;
        }
        this.highlighted = isHighlight;
        this.update();
    },
    disableInteractions: function (disable) {
        this.isDisableInteractions = disable;
    },
    delete: function () {
        this.editor.deleteAnnotation(this);
    },
    getDefaultStyle: function () {
        var style = {};
        style['stroke-width'] = 3;
        style['stroke-color'] = '#ff0000';
        style['stroke-opacity'] = 1.0;
        style['fill-color'] = '#ff0000';
        style['fill-opacity'] = 0.0;
        style['font-family'] = 'Arial';
        style['font-size'] = 16;
        style['font-style'] = ''; // 'italic'
        style['font-weight'] = ''; // 'bold'
        return style;
    }
};
CLOUD.Extensions.Annotation.shapeTypes = {ARROW: 0, RECTANGLE: 1, CIRCLE: 2, CROSS: 3, CLOUD: 4, TEXT: 5};
CLOUD.Extensions.AnnotationArrow = function (editor, id) {
    CLOUD.Extensions.Annotation.call(this, editor, id);
    this.shapeType = CLOUD.Extensions.Annotation.shapeTypes.ARROW;
    this.head = new THREE.Vector2();
    this.tail = new THREE.Vector2();
    this.disableResizeHeight = true;
    this.size.height = this.style['stroke-width'] * 4; // 箭头固定高度
    this.createShape();
    this.addDomEventListeners();
};
CLOUD.Extensions.AnnotationArrow.prototype = Object.create(CLOUD.Extensions.Annotation.prototype);
CLOUD.Extensions.AnnotationArrow.prototype.constructor = CLOUD.Extensions.AnnotationArrow;
CLOUD.Extensions.AnnotationArrow.prototype.addDomEventListeners = function () {
    this.shape.addEventListener("mousedown", this.onMouseDownBinded, true);
    this.shape.addEventListener("mouseout", this.onMouseOutBinded);
    this.shape.addEventListener("mouseover", this.onMouseOverBinded);
};
CLOUD.Extensions.AnnotationArrow.prototype.removeDomEventListeners = function () {
    this.shape.removeEventListener("mousedown", this.onMouseDownBinded, true);
    this.shape.removeEventListener("mouseout", this.onMouseOutBinded);
    this.shape.removeEventListener("mouseover", this.onMouseOverBinded);
};
CLOUD.Extensions.AnnotationArrow.prototype.createShape = function () {
    this.shape = CLOUD.Extensions.Utils.Shape2D.createSvgElement('polygon');
};
CLOUD.Extensions.AnnotationArrow.prototype.setByTailHead = function (tail, head) {
    var v0 = new THREE.Vector2(tail.x, tail.y);
    var v1 = new THREE.Vector2(head.x, head.y);
    var dir = v1.clone().sub(v0).normalize();
    // 计算尺寸
    this.size.width = v0.distanceTo(v1);
    // 计算旋转角度
    this.rotation = Math.acos(dir.dot(new THREE.Vector2(1, 0)));
    this.rotation = head.y > tail.y ? (Math.PI * 2) - this.rotation : this.rotation;
    this.tail.set(tail.x, tail.y);
    this.head.set(head.x, head.y);
    var depth = tail.z;
    this.position.x = 0.5 * (this.head.x + this.tail.x);
    this.position.y = 0.5 * (this.head.y + this.tail.y);
    this.position.z = depth;
    this.update();
};
CLOUD.Extensions.AnnotationArrow.prototype.getClientSize = function () {
    var size = this.editor.getAnnotationClientSize(this.size, this.position);
    size.height = this.style['stroke-width'] * 4;
    return size;
};
CLOUD.Extensions.AnnotationArrow.prototype.resetSize = function (size, position) {
    var dir = new THREE.Vector2(Math.cos(this.rotation), Math.sin(this.rotation));
    dir.multiplyScalar(size.width * 0.5);
    var center = new THREE.Vector2(position.x, position.y);
    var tail = center.clone().sub(dir);
    var head = center.clone().add(dir);
    this.tail.set(tail.x, tail.y);
    this.head.set(head.x, head.y);
    this.position.x = position.x;
    this.position.y = position.y;
    this.position.z = position.z;
    this.size.width = size.width;
    this.update();
};
CLOUD.Extensions.AnnotationArrow.prototype.resetPosition = function (position) {
    var dx = this.head.x - this.tail.x;
    var dy = this.head.y - this.tail.y;
    this.tail.x = position.x - dx * 0.5;
    this.tail.y = position.y - dy * 0.5;
    this.head.x = this.tail.x + dx;
    this.head.y = this.tail.y + dy;
    this.position.x = position.x;
    this.position.y = position.y;
    this.position.z = position.z;
    this.update();
};
CLOUD.Extensions.AnnotationArrow.prototype.update = function () {
    var strokeColor = this.highlighted ? this.highlightColor : this.style['stroke-color'];
    var strokeOpacity = this.style['stroke-opacity'];
    var shapePoints = this.getShapePoints();
    var mappedPoints = shapePoints.map(function (point) {
        return point[0] + ',' + point[1];
    });
    var pointsStr = mappedPoints.join(' ');
    var position = this.getClientPosition();
    var size = this.getClientSize();
    var offsetX = 0.5 * size.width;
    var offsetY = 0.5 * size.height;
    this.transformShape = [
        'translate(', position.x, ',', position.y, ') ',
        'rotate(', THREE.Math.radToDeg(this.rotation), ') ',
        'translate(', -offsetX, ',', -offsetY, ') '
    ].join('');
    this.shape.setAttribute('points', pointsStr);
    this.shape.setAttribute("transform", this.transformShape);
    this.shape.setAttribute('fill', strokeColor);
    this.shape.setAttribute('opacity', strokeOpacity);
};
CLOUD.Extensions.AnnotationArrow.prototype.getShapePoints = function () {
    var strokeWidth = this.style['stroke-width'] * 2;
    var size = this.getClientSize();
    var halfLen = size.width * 0.5;
    var thickness = strokeWidth;
    var halfThickness = strokeWidth * 0.5;
    var headLen = halfLen - (2.0 * thickness);
    var p1 = [-halfLen, -halfThickness];
    var p2 = [headLen, -halfThickness];
    var p3 = [headLen, -thickness];
    var p4 = [halfLen, 0];
    var p5 = [headLen, thickness];
    var p6 = [headLen, halfThickness];
    var p7 = [-halfLen, halfThickness];
    var points = [p1, p2, p3, p4, p5, p6, p7];
    points.forEach(function (point) {
        point[0] += halfLen;
        point[1] += thickness;
    });
    return points;
};
CLOUD.Extensions.AnnotationArrow.prototype.renderToCanvas = function (ctx) {
    var strokeWidth = this.style['stroke-width'] * 2;
    var strokeColor = this.style['stroke-color'];
    var strokeOpacity = this.style['stroke-opacity'];
    var position = this.getClientPosition();
    var size = this.getClientSize();
    var offsetX = size.width * 0.5;
    var offsetY = strokeWidth;
    var m1 = new THREE.Matrix4().makeTranslation(-offsetX, -offsetY, 0);
    var m2 = new THREE.Matrix4().makeRotationZ(this.rotation);
    var m3 = new THREE.Matrix4().makeTranslation(position.x, position.y, 0);
    var transform = m3.multiply(m2).multiply(m1);
    var points = this.getShapePoints();
    ctx.fillStyle = CLOUD.Extensions.Utils.Shape2D.getRGBAString(strokeColor, strokeOpacity);
    ctx.beginPath();
    points.forEach(function (point) {
        var client = new THREE.Vector3(point[0], point[1], 0);
        client.applyMatrix4(transform);
        ctx.lineTo(client.x, client.y);
    });
    ctx.fill();
};
CLOUD.Extensions.AnnotationRectangle = function (editor, id) {
    CLOUD.Extensions.Annotation.call(this, editor, id);
    this.shapeType = CLOUD.Extensions.Annotation.shapeTypes.RECTANGLE;
    this.createShape();
    this.addDomEventListeners();
};
CLOUD.Extensions.AnnotationRectangle.prototype = Object.create(CLOUD.Extensions.Annotation.prototype);
CLOUD.Extensions.AnnotationRectangle.prototype.constructor = CLOUD.Extensions.AnnotationRectangle;
CLOUD.Extensions.AnnotationRectangle.prototype.addDomEventListeners = function () {
    this.shape.addEventListener("mousedown", this.onMouseDownBinded, true);
    this.shape.addEventListener("mouseout", this.onMouseOutBinded);
    this.shape.addEventListener("mouseover", this.onMouseOverBinded);
};
CLOUD.Extensions.AnnotationRectangle.prototype.removeDomEventListeners = function () {
    this.shape.removeEventListener("mousedown", this.onMouseDownBinded, true);
    this.shape.removeEventListener("mouseout", this.onMouseOutBinded);
    this.shape.removeEventListener("mouseover", this.onMouseOverBinded);
};
CLOUD.Extensions.AnnotationRectangle.prototype.createShape = function () {
    this.shape = CLOUD.Extensions.Utils.Shape2D.createSvgElement('rect');
};
CLOUD.Extensions.AnnotationRectangle.prototype.update = function () {
    var strokeWidth = this.style['stroke-width'];
    var strokeColor = this.highlighted ? this.highlightColor : this.style['stroke-color'];
    var strokeOpacity = this.style['stroke-opacity'];
    var fillColor = this.style['fill-color'];
    var fillOpacity = this.style['fill-opacity'];
    var position = this.getClientPosition();
    var size = this.getClientSize();
    var width = Math.max(size.width - strokeWidth, 0);
    var height = Math.max(size.height - strokeWidth, 0);
    var offsetX = 0.5 * width;
    var offsetY = 0.5 * height;
    this.transformShape = [
        'translate(', position.x, ',', position.y, ') ',
        'rotate(', THREE.Math.radToDeg(this.rotation), ') ',
        'translate(', -offsetX, ',', -offsetY, ') '
    ].join('');
    this.shape.setAttribute('transform', this.transformShape);
    this.shape.setAttribute('stroke-width', strokeWidth);
    this.shape.setAttribute("stroke", CLOUD.Extensions.Utils.Shape2D.getRGBAString(strokeColor, strokeOpacity));
    this.shape.setAttribute('fill', CLOUD.Extensions.Utils.Shape2D.getRGBAString(fillColor, fillOpacity));
    this.shape.setAttribute('width', width + '');
    this.shape.setAttribute('height', height + '');
};
CLOUD.Extensions.AnnotationRectangle.prototype.renderToCanvas = function (ctx) {
    var strokeWidth = this.style['stroke-width'];
    var strokeColor = this.highlighted ? this.highlightColor : this.style['stroke-color'];
    var strokeOpacity = this.style['stroke-opacity'];
    var fillColor = this.style['fill-color'];
    var fillOpacity = this.style['fill-opacity'];
    var size = this.getClientSize();
    var position = this.getClientPosition();
    var width = Math.max(size.width - strokeWidth, 0);
    var height = Math.max(size.height - strokeWidth, 0);
    ctx.strokeStyle = CLOUD.Extensions.Utils.Shape2D.getRGBAString(strokeColor, strokeOpacity);
    ctx.fillStyle = CLOUD.Extensions.Utils.Shape2D.getRGBAString(fillColor, fillOpacity);
    ctx.lineWidth = strokeWidth;
    ctx.translate(position.x, position.y);
    ctx.rotate(this.rotation);
    ctx.beginPath();
    if (fillOpacity !== 0) {
        ctx.fillRect(width / -2, height / -2, width, height);
    }
    ctx.strokeRect(width / -2, height / -2, width, height);
};
CLOUD.Extensions.AnnotationCircle = function (editor, id) {
    CLOUD.Extensions.Annotation.call(this, editor, id);
    this.shapeType = CLOUD.Extensions.Annotation.shapeTypes.CIRCLE;
    this.createShape();
    this.addDomEventListeners();
};
CLOUD.Extensions.AnnotationCircle.prototype = Object.create(CLOUD.Extensions.Annotation.prototype);
CLOUD.Extensions.AnnotationCircle.prototype.constructor = CLOUD.Extensions.AnnotationCircle;
CLOUD.Extensions.AnnotationCircle.prototype.addDomEventListeners = function () {
    this.shape.addEventListener("mousedown", this.onMouseDownBinded, true);
    this.shape.addEventListener("mouseout", this.onMouseOutBinded);
    this.shape.addEventListener("mouseover", this.onMouseOverBinded);
};
CLOUD.Extensions.AnnotationCircle.prototype.removeDomEventListeners = function () {
    this.shape.removeEventListener("mousedown", this.onMouseDownBinded, true);
    this.shape.removeEventListener("mouseout", this.onMouseOutBinded);
    this.shape.removeEventListener("mouseover", this.onMouseOverBinded);
};
CLOUD.Extensions.AnnotationCircle.prototype.createShape = function () {
    this.shape = CLOUD.Extensions.Utils.Shape2D.createSvgElement('ellipse');
};
CLOUD.Extensions.AnnotationCircle.prototype.update = function () {
    var strokeWidth = this.style['stroke-width'];
    var strokeColor = this.highlighted ? this.highlightColor : this.style['stroke-color'];
    var strokeOpacity = this.style['stroke-opacity'];
    var fillColor = this.style['fill-color'];
    var fillOpacity = this.style['fill-opacity'];
    var position = this.getClientPosition();
    var size = this.getClientSize();
    var offsetX = Math.max(size.width - strokeWidth, 0) * 0.5;
    var offsetY = Math.max(size.height - strokeWidth, 0) * 0.5;
    this.transformShape = [
        'translate(', position.x, ',', position.y, ') ',
        'rotate(', THREE.Math.radToDeg(this.rotation), ') ',
        'translate(', -offsetX, ',', -offsetY, ') '
    ].join('');
    this.shape.setAttribute("transform", this.transformShape);
    this.shape.setAttribute("stroke-width", strokeWidth);
    this.shape.setAttribute("stroke", CLOUD.Extensions.Utils.Shape2D.getRGBAString(strokeColor, strokeOpacity));
    this.shape.setAttribute('fill', CLOUD.Extensions.Utils.Shape2D.getRGBAString(fillColor, fillOpacity));
    this.shape.setAttribute('cx', offsetX);
    this.shape.setAttribute('cy', offsetY);
    this.shape.setAttribute('rx', offsetX);
    this.shape.setAttribute('ry', offsetY);
};
CLOUD.Extensions.AnnotationCircle.prototype.renderToCanvas = function (ctx) {
    function ellipse(ctx, cx, cy, w, h) {
        ctx.beginPath();
        var lx = cx - w / 2,
            rx = cx + w / 2,
            ty = cy - h / 2,
            by = cy + h / 2;
        var magic = 0.551784;
        var xmagic = magic * w / 2;
        var ymagic = magic * h / 2;
        ctx.moveTo(cx, ty);
        ctx.bezierCurveTo(cx + xmagic, ty, rx, cy - ymagic, rx, cy);
        ctx.bezierCurveTo(rx, cy + ymagic, cx + xmagic, by, cx, by);
        ctx.bezierCurveTo(cx - xmagic, by, lx, cy + ymagic, lx, cy);
        ctx.bezierCurveTo(lx, cy - ymagic, cx - xmagic, ty, cx, ty);
        ctx.stroke();
    }
    
    var strokeWidth = this.style['stroke-width'];
    var strokeColor = this.style['stroke-color'];
    var strokeOpacity = this.style['stroke-opacity'];
    var fillColor = this.style['fill-color'];
    var fillOpacity = this.style['fill-opacity'];
    var position = this.getClientPosition();
    var size = this.getClientSize();
    var width = Math.max(size.width - strokeWidth, 0);
    var height = Math.max(size.height - strokeWidth, 0);
    ctx.strokeStyle = CLOUD.Extensions.Utils.Shape2D.getRGBAString(strokeColor, strokeOpacity);
    ctx.fillStyle = CLOUD.Extensions.Utils.Shape2D.getRGBAString(fillColor, fillOpacity);
    ctx.lineWidth = strokeWidth;
    ctx.translate(position.x, position.y);
    ctx.rotate(this.rotation);
    //ctx.beginPath();
    ellipse(ctx, 0, 0, width, height);
    if (fillOpacity !== 0) {
        ctx.fill();
    }
    //ctx.stroke();
};
CLOUD.Extensions.AnnotationCloud = function (editor, id) {
    CLOUD.Extensions.Annotation.call(this, editor, id);
    this.shapeType = CLOUD.Extensions.Annotation.shapeTypes.CLOUD;
    this.shapePoints = [];
    this.trackingPoint = {x: 0, y: 0};
    this.isSeal = false; // 是否封口
    this.isTracking = false;
    this.isEnableTrack = false;
    this.originSize = {width: 1, height: 1};
    this.viewBox = {width: 1000, height: 1000};
    this.createShape();
    this.addDomEventListeners();
};
CLOUD.Extensions.AnnotationCloud.prototype = Object.create(CLOUD.Extensions.Annotation.prototype);
CLOUD.Extensions.AnnotationCloud.prototype.constructor = CLOUD.Extensions.AnnotationCloud;
CLOUD.Extensions.AnnotationCloud.prototype.addDomEventListeners = function () {
    this.shape.addEventListener("mousedown", this.onMouseDownBinded, true);
    this.shape.addEventListener("mouseout", this.onMouseOutBinded);
    this.shape.addEventListener("mouseover", this.onMouseOverBinded);
};
CLOUD.Extensions.AnnotationCloud.prototype.removeDomEventListeners = function () {
    this.shape.removeEventListener("mousedown", this.onMouseDownBinded, true);
    this.shape.removeEventListener("mouseout", this.onMouseOutBinded);
    this.shape.removeEventListener("mouseover", this.onMouseOverBinded);
};
CLOUD.Extensions.AnnotationCloud.prototype.createShape = function () {
    this.shape = CLOUD.Extensions.Utils.Shape2D.createSvgElement('path');
};
CLOUD.Extensions.AnnotationCloud.prototype.setByPositions = function (positions, isSeal) {
    this.positions = positions.concat();
    this.isSeal = isSeal || false;
    // 计算位置及大小
    this.calculatePosition(true);
    this.originSize.width = (this.size.width === 0) ? 1 : this.size.width;
    this.originSize.height = (this.size.height === 0) ? 1 : this.size.height;
    this.update();
};
CLOUD.Extensions.AnnotationCloud.prototype.set = function (position, size, rotation, shapePointsStr, originSize) {
    this.position.x = position.x;
    this.position.y = position.y;
    this.position.z = position.z;
    this.size.width = size.width;
    this.size.height = size.height;
    this.rotation = rotation || 0;
    if (originSize) {
        this.originSize.width = (originSize.width === 0) ? 1 : originSize.width;
        this.originSize.height = (originSize.height === 0) ? 1 : originSize.height;
    } else {
        this.originSize.width = (this.size.width === 0) ? 1 : this.size.width;
        this.originSize.height = (this.size.height === 0) ? 1 : this.size.height;
    }
    this.setShapePoints(shapePointsStr);
    this.update();
};
CLOUD.Extensions.AnnotationCloud.prototype.setTrackingPoint = function (point) {
    this.trackingPoint.x = point.x;
    this.trackingPoint.y = point.y;
    this.calculatePosition(false);
    this.update();
};
CLOUD.Extensions.AnnotationCloud.prototype.update = function () {
    if (this.shapePoints.length < 1) return;
    var shapePathStr = this.getPathString();
    var strokeWidth = this.style['stroke-width'];
    var strokeColor = this.highlighted ? this.highlightColor : this.style['stroke-color'];
    var strokeOpacity = this.style['stroke-opacity'];
    var fillColor = this.style['fill-color'];
    var fillOpacity = this.style['fill-opacity'];
    this.shape.setAttribute("stroke-width", strokeWidth);
    this.shape.setAttribute("stroke", CLOUD.Extensions.Utils.Shape2D.getRGBAString(strokeColor, strokeOpacity));
    this.shape.setAttribute('fill', CLOUD.Extensions.Utils.Shape2D.getRGBAString(fillColor, fillOpacity));
    this.shape.setAttribute('d', shapePathStr);
};
CLOUD.Extensions.AnnotationCloud.prototype.worldToViewBox = function (wPoint) {
    var originWidth = this.originSize.width;
    var originHeight = this.originSize.height;
    var viewBoxWidth = this.viewBox.width;
    var viewBoxHeight = this.viewBox.height;
    var x = Math.floor(wPoint.x / originWidth * viewBoxWidth + 0.5);
    var y = Math.floor(wPoint.y / originHeight * viewBoxHeight + 0.5);
    return {x: x, y: y};
};
CLOUD.Extensions.AnnotationCloud.prototype.viewBoxToWorld = function (vPoint) {
    var originWidth = this.originSize.width;
    var originHeight = this.originSize.height;
    var viewBoxWidth = this.viewBox.width;
    var viewBoxHeight = this.viewBox.height;
    var x = vPoint.x / viewBoxWidth * originWidth;
    var y = vPoint.y / viewBoxHeight * originHeight;
    return {x: x, y: y};
};
CLOUD.Extensions.AnnotationCloud.prototype.getPathString = function () {
    
    //var path = this.shapePoints.map(function(point, i){
    //    if (i === 0) {
    //        return ['M'].concat([point.x, point.y]).join(' ');
    //    } else {
    //        return ['Q'].concat([point.cx, point.cy, point.x, point.y ]).join(' ');
    //    }
    //}).join(' ');
    //
    //if (this.isSeal) {
    //    path += 'Z';
    //}
    //
    //return path;
    var scaleX = this.size.width / this.originSize.width;
    var scaleY = this.size.height / this.originSize.height;
    var m0 = new THREE.Matrix4().makeScale(scaleX, scaleY, 1);
    var m1 = new THREE.Matrix4().makeRotationZ(-this.rotation);
    var m2 = new THREE.Matrix4().makeTranslation(this.position.x, this.position.y, this.position.z);
    var transform = m2.multiply(m1).multiply(m0);
    var scope = this;
    var pos = new THREE.Vector3();
    var x, y, cx, cy;
    var path = this.shapePoints.map(function (point, i) {
        if (i === 0) {
            pos.x = point.x;
            pos.y = point.y;
            pos.z = 0;
            pos.applyMatrix4(transform);
            pos = scope.editor.worldToClient(pos);
            x = pos.x;
            y = pos.y;
            return ['M'].concat([x, y]).join(' ');
        } else {
            pos.x = point.cx;
            pos.y = point.cy;
            pos.z = 0;
            pos.applyMatrix4(transform);
            pos = scope.editor.worldToClient(pos);
            cx = pos.x;
            cy = pos.y;
            pos.x = point.x;
            pos.y = point.y;
            pos.z = 0;
            pos.applyMatrix4(transform);
            pos = scope.editor.worldToClient(pos);
            x = pos.x;
            y = pos.y;
            return ['Q'].concat([cx, cy, x, y]).join(' ');
        }
    }).join(' ');
    if (this.isSeal) {
        path += 'Z';
    }
    return path;
};
// 计算控制点
CLOUD.Extensions.AnnotationCloud.prototype.getControlPoint = function (startPoint, endPoint) {
    var start = new THREE.Vector2(startPoint.x, startPoint.y);
    var end = new THREE.Vector2(endPoint.x, endPoint.y);
    var direction = end.clone().sub(start);
    var halfLen = 0.5 * direction.length();
    var centerX = 0.5 * (start.x + end.x);
    var centerY = 0.5 * (start.y + end.y);
    var center = new THREE.Vector2(centerX, centerY);
    direction.normalize();
    direction.rotateAround(new THREE.Vector2(0, 0), 0.5 * Math.PI);
    direction.multiplyScalar(halfLen);
    center.add(direction);
    return {
        x: center.x,
        y: center.y
    };
};
CLOUD.Extensions.AnnotationCloud.prototype.getBoundingBox = function () {
    var box = new THREE.Box2();
    var point = new THREE.Vector2();
    for (var i = 0, len = this.shapePoints.length; i < len; i++) {
        if (i === 0) {
            point.set(this.shapePoints[i].x, this.shapePoints[i].y);
            box.expandByPoint(point);
        } else {
            point.set(this.shapePoints[i].cx, this.shapePoints[i].cy);
            box.expandByPoint(point);
            point.set(this.shapePoints[i].x, this.shapePoints[i].y);
            box.expandByPoint(point);
        }
    }
    return box;
};
CLOUD.Extensions.AnnotationCloud.prototype.calculateShapePath = function () {
    var originShapePoint = {};
    var currentShapePoint = {};
    var lastShapePoint = {};
    var controlPoint;
    var len = this.positions.length;
    this.shapePoints = [];
    if (len < 1) {
        return;
    }
    // 保存深度
    this.depth = this.positions[0].z || 0;
    if (len === 1) {
        currentShapePoint.x = this.positions[0].x;
        currentShapePoint.y = this.positions[0].y;
        this.shapePoints.push({x: this.positions[0].x, y: this.positions[0].y});
        if (this.isTracking) {
            
            // 计算控制点
            controlPoint = this.getControlPoint(currentShapePoint, this.trackingPoint);
            this.shapePoints.push({
                cx: controlPoint.x, cy: controlPoint.y, x: this.trackingPoint.x, y: this.trackingPoint.y
            });
        }
    } else {
        for (var i = 0; i < len; i++) {
            currentShapePoint.x = this.positions[i].x;
            currentShapePoint.y = this.positions[i].y;
            if (i === 0) {
                this.shapePoints.push({x: this.positions[i].x, y: this.positions[i].y});
                lastShapePoint.x = this.positions[i].x;
                lastShapePoint.y = this.positions[i].y;
                originShapePoint.x = this.positions[i].x;
                originShapePoint.y = this.positions[i].y;
            } else {
                
                // 计算控制点
                controlPoint = this.getControlPoint(lastShapePoint, currentShapePoint);
                this.shapePoints.push({
                    cx: controlPoint.x, cy: controlPoint.y, x: currentShapePoint.x, y: currentShapePoint.y
                });
                lastShapePoint.x = currentShapePoint.x;
                lastShapePoint.y = currentShapePoint.y;
                // 最后一个点, 处理封口
                if (i === len - 1) {
                    if (this.isTracking) {
                        
                        // 计算控制点
                        controlPoint = this.getControlPoint(lastShapePoint, this.trackingPoint);
                        this.shapePoints.push({
                            cx: controlPoint.x, cy: controlPoint.y, x: this.trackingPoint.x, y: this.trackingPoint.y
                        });
                    } else if (this.isSeal) {
                        // 计算控制点
                        controlPoint = this.getControlPoint(lastShapePoint, originShapePoint);
                        this.shapePoints.push({
                            cx: controlPoint.x, cy: controlPoint.y, x: originShapePoint.x, y: originShapePoint.y
                        });
                    }
                }
            }
        }
    }
};
CLOUD.Extensions.AnnotationCloud.prototype.calculateRelativePosition = function (center) {
    
    // 计算相对位置
    for (var i = 0, len = this.shapePoints.length; i < len; i++) {
        if (i === 0) {
            this.shapePoints[i].x -= center.x;
            this.shapePoints[i].y -= center.y;
        } else {
            this.shapePoints[i].x -= center.x;
            this.shapePoints[i].y -= center.y;
            this.shapePoints[i].cx -= center.x;
            this.shapePoints[i].cy -= center.y;
        }
    }
};
CLOUD.Extensions.AnnotationCloud.prototype.calculatePosition = function (force) {
    force = force || false;
    // 计算控制点
    this.calculateShapePath();
    if (force) {
        var box = this.getBoundingBox();
        var center = box.getCenter();
        this.center = {x: center.x, y: center.y};
        // 计算中心点
        this.position.x = center.x;
        this.position.y = center.y;
        this.position.z = this.depth || 0;
        // 计算相对位置
        this.calculateRelativePosition(center);
        // 重计算包围盒
        box = this.getBoundingBox();
        var size = box.size();
        this.size.width = size.x || 16;
        this.size.height = size.y || 16;
    } else {
        if (this.center) {
            
            // 计算相对位置
            this.calculateRelativePosition(this.center);
        }
    }
};
CLOUD.Extensions.AnnotationCloud.prototype.startTrack = function () {
    this.isTracking = true;
};
CLOUD.Extensions.AnnotationCloud.prototype.finishTrack = function () {
    this.isTracking = false;
};
CLOUD.Extensions.AnnotationCloud.prototype.enableTrack = function () {
    this.isEnableTrack = true;
};
CLOUD.Extensions.AnnotationCloud.prototype.disableTrack = function () {
    this.isEnableTrack = false;
};
CLOUD.Extensions.AnnotationCloud.prototype.getTrackState = function () {
    return this.isEnableTrack;
};
CLOUD.Extensions.AnnotationCloud.prototype.setSeal = function (isSeal) {
    this.isSeal = isSeal;
    this.calculatePosition(false);
    this.update();
};
// 设置形状点集
CLOUD.Extensions.AnnotationCloud.prototype.setShapePoints = function (shapeStr) {
    var x, y, cx, cy, retPoint;
    var shapePoints = shapeStr.split(',');
    var x0 = parseInt(shapePoints[0]);
    var y0 = parseInt(shapePoints[1]);
    retPoint = this.viewBoxToWorld({x: x0, y: y0});
    x0 = retPoint.x;
    y0 = retPoint.y;
    this.shapePoints = [];
    this.shapePoints.push({x: x0, y: y0});
    for (var i = 2, len = shapePoints.length; i < len; i += 4) {
        cx = parseInt(shapePoints[i]);
        cy = parseInt(shapePoints[i + 1]);
        retPoint = this.viewBoxToWorld({x: cx, y: cy});
        cx = retPoint.x;
        cy = retPoint.y;
        x = parseInt(shapePoints[i + 2]);
        y = parseInt(shapePoints[i + 3]);
        retPoint = this.viewBoxToWorld({x: x, y: y});
        x = retPoint.x;
        y = retPoint.y;
        this.shapePoints.push({cx: cx, cy: cy, x: x, y: y});
    }
};
// 获得形状点集字符串（用“，”分割）
CLOUD.Extensions.AnnotationCloud.prototype.getShapePoints = function () {
    var points = [];
    // 转成整型存储以减少存储空间
    var x, y, cx, cy, retPoint;
    for (var i = 0, len = this.shapePoints.length; i < len; i++) {
        if (i === 0) {
            x = this.shapePoints[i].x;
            y = this.shapePoints[i].y;
            retPoint = this.worldToViewBox({x: x, y: y});
            x = retPoint.x;
            y = retPoint.y;
            points.push(x);
            points.push(y);
        } else {
            cx = this.shapePoints[i].cx;
            cy = this.shapePoints[i].cy;
            retPoint = this.worldToViewBox({x: cx, y: cy});
            cx = retPoint.x;
            cy = retPoint.y;
            points.push(cx);
            points.push(cy);
            x = this.shapePoints[i].x;
            y = this.shapePoints[i].y;
            retPoint = this.worldToViewBox({x: x, y: y});
            x = retPoint.x;
            y = retPoint.y;
            points.push(x);
            points.push(y);
        }
    }
    return points.join(',');
};
CLOUD.Extensions.AnnotationCloud.prototype.renderToCanvas = function (ctx) {
    
    // 小于两个点，不处理
    if (this.shapePoints.length < 2) return;
    var strokeWidth = this.style['stroke-width'];
    var strokeColor = this.highlighted ? this.highlightColor : this.style['stroke-color'];
    var strokeOpacity = this.style['stroke-opacity'];
    var fillColor = this.style['fill-color'];
    var fillOpacity = this.style['fill-opacity'];
    ctx.strokeStyle = CLOUD.Extensions.Utils.Shape2D.getRGBAString(strokeColor, strokeOpacity);
    ctx.fillStyle = CLOUD.Extensions.Utils.Shape2D.getRGBAString(fillColor, fillOpacity);
    ctx.lineWidth = strokeWidth;
    var scaleX = this.size.width / this.originSize.width;
    var scaleY = this.size.height / this.originSize.height;
    var m0 = new THREE.Matrix4().makeScale(scaleX, scaleY, 1);
    var m1 = new THREE.Matrix4().makeRotationZ(-this.rotation);
    var m2 = new THREE.Matrix4().makeTranslation(this.position.x, this.position.y, this.position.z);
    var transform = m2.multiply(m1).multiply(m0);
    var scope = this;
    ctx.beginPath();
    var pos = new THREE.Vector3();
    var x, y, cx, cy;
    this.shapePoints.forEach(function (point, i) {
        if (i === 0) {
            pos.x = point.x;
            pos.y = point.y;
            pos.z = 0;
            pos.applyMatrix4(transform);
            pos = scope.editor.worldToClient(pos);
            x = pos.x;
            y = pos.y;
            ctx.moveTo(x, y);
        } else {
            pos.x = point.cx;
            pos.y = point.cy;
            pos.z = 0;
            pos.applyMatrix4(transform);
            pos = scope.editor.worldToClient(pos);
            cx = pos.x;
            cy = pos.y;
            pos.x = point.x;
            pos.y = point.y;
            pos.z = 0;
            pos.applyMatrix4(transform);
            pos = scope.editor.worldToClient(pos);
            x = pos.x;
            y = pos.y;
            ctx.quadraticCurveTo(cx, cy, x, y);
        }
    });
    ctx.stroke();
    if (fillOpacity !== 0) {
        ctx.fill();
    }
    ctx.stroke();
};
CLOUD.Extensions.AnnotationCross = function (editor, id) {
    CLOUD.Extensions.Annotation.call(this, editor, id);
    this.shapeType = CLOUD.Extensions.Annotation.shapeTypes.CROSS;
    this.createShape();
    this.addDomEventListeners();
};
CLOUD.Extensions.AnnotationCross.prototype = Object.create(CLOUD.Extensions.Annotation.prototype);
CLOUD.Extensions.AnnotationCross.prototype.constructor = CLOUD.Extensions.AnnotationCross;
CLOUD.Extensions.AnnotationCross.prototype.addDomEventListeners = function () {
    this.shape.addEventListener("mousedown", this.onMouseDownBinded, true);
    this.shape.addEventListener("mouseout", this.onMouseOutBinded);
    this.shape.addEventListener("mouseover", this.onMouseOverBinded);
};
CLOUD.Extensions.AnnotationCross.prototype.removeDomEventListeners = function () {
    this.shape.removeEventListener("mousedown", this.onMouseDownBinded, true);
    this.shape.removeEventListener("mouseout", this.onMouseOutBinded);
    this.shape.removeEventListener("mouseover", this.onMouseOverBinded);
};
CLOUD.Extensions.AnnotationCross.prototype.createShape = function () {
    this.shape = CLOUD.Extensions.Utils.Shape2D.createSvgElement('path');
};
CLOUD.Extensions.AnnotationCross.prototype.update = function () {
    var strokeWidth = this.style['stroke-width'];
    var strokeColor = this.highlighted ? this.highlightColor : this.style['stroke-color'];
    var strokeOpacity = this.style['stroke-opacity'];
    var fillColor = this.style['fill-color'];
    var fillOpacity = this.style['fill-opacity'];
    var position = this.getClientPosition();
    var size = this.getClientSize();
    var offsetX = Math.max(size.width - strokeWidth, 0) * 0.5;
    var offsetY = Math.max(size.height - strokeWidth, 0) * 0.5;
    this.transformShape = [
        'translate(', position.x, ',', position.y, ') ',
        'rotate(', THREE.Math.radToDeg(this.rotation), ') ',
        'translate(', -offsetX, ',', -offsetY, ') '
    ].join('');
    this.shape.setAttribute('transform', this.transformShape);
    this.shape.setAttribute('stroke-width', strokeWidth);
    //this.shape.setAttribute('stroke',strokeColor);
    //this.shape.setAttribute('stroke-opacity',strokeOpacity);
    //this.shape.setAttribute('fill', fillColor);
    //this.shape.setAttribute('fill-opacity', fillOpacity);
    this.shape.setAttribute("stroke", CLOUD.Extensions.Utils.Shape2D.getRGBAString(strokeColor, strokeOpacity));
    this.shape.setAttribute('fill', CLOUD.Extensions.Utils.Shape2D.getRGBAString(fillColor, fillOpacity));
    this.shape.setAttribute('d', this.getPath().join(' '));
};
CLOUD.Extensions.AnnotationCross.prototype.getPath = function () {
    var size = this.getClientSize();
    var l = 0;
    var t = 0;
    var r = size.width;
    var b = size.height;
    var path = [];
    path.push('M');
    path.push(l);
    path.push(t);
    path.push('L');
    path.push(r);
    path.push(b);
    path.push('z');
    path.push('M');
    path.push(l);
    path.push(b);
    path.push('L');
    path.push(r);
    path.push(t);
    path.push('z');
    return path;
};
CLOUD.Extensions.AnnotationCross.prototype.renderToCanvas = function (ctx) {
    var strokeWidth = this.style['stroke-width'];
    var strokeColor = this.highlighted ? this.highlightColor : this.style['stroke-color'];
    var strokeOpacity = this.style['stroke-opacity'];
    var fillColor = this.style['fill-color'];
    var fillOpacity = this.style['fill-opacity'];
    var position = this.getClientPosition();
    var size = this.getClientSize();
    var width = Math.max(size.width - strokeWidth, 0);
    var height = Math.max(size.height - strokeWidth, 0);
    ctx.strokeStyle = CLOUD.Extensions.Utils.Shape2D.getRGBAString(strokeColor, strokeOpacity);
    ctx.fillStyle = CLOUD.Extensions.Utils.Shape2D.getRGBAString(fillColor, fillOpacity);
    ctx.lineWidth = strokeWidth;
    ctx.translate(position.x, position.y);
    ctx.rotate(this.rotation);
    ctx.translate(-0.5 * width, -0.5 * height);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, height);
    ctx.moveTo(0, height);
    ctx.lineTo(width, 0);
    ctx.stroke();
    if (fillOpacity !== 0) {
        ctx.fill();
    }
    ctx.stroke();
};
CLOUD.Extensions.AnnotationText = function (editor, id) {
    CLOUD.Extensions.Annotation.call(this, editor, id);
    this.shapeType = CLOUD.Extensions.Annotation.shapeTypes.TEXT;
    this.currText = "";
    this.currTextLines = [""];
    this.textDirty = true;
    this.lineHeight = 100; // 单位 %
    // this.textArea = document.createElement('textarea');
    // this.textArea.setAttribute('maxlength', '260');
    //
    // this.textAreaStyle = {};
    // this.textAreaStyle['position'] = 'absolute';
    // this.textAreaStyle['overflow-y'] = 'hidden';
    //
    // this.measurePanel = document.createElement('div');
    // this.isActive = false;
    this.createShape();
    this.addDomEventListeners();
};
CLOUD.Extensions.AnnotationText.prototype = Object.create(CLOUD.Extensions.Annotation.prototype);
CLOUD.Extensions.AnnotationText.prototype.constructor = CLOUD.Extensions.AnnotationText;
CLOUD.Extensions.AnnotationText.prototype.addDomEventListeners = function () {
    this.shape.addEventListener("mousedown", this.onMouseDownBinded, true);
    this.shape.addEventListener("mouseout", this.onMouseOutBinded);
    this.shape.addEventListener("mouseover", this.onMouseOverBinded);
};
CLOUD.Extensions.AnnotationText.prototype.removeDomEventListeners = function () {
    this.shape.removeEventListener("mousedown", this.onMouseDownBinded, true);
    this.shape.removeEventListener("mouseout", this.onMouseOutBinded);
    this.shape.removeEventListener("mouseover", this.onMouseOverBinded);
};
CLOUD.Extensions.AnnotationText.prototype.createShape = function () {
    this.clipPath = CLOUD.Extensions.Utils.Shape2D.createSvgElement('clipPath');
    this.clipPathId = 'clip_' + this.id;
    this.clipPath.setAttribute('id', this.clipPathId);
    this.clipPath.removeAttribute('pointer-events');
    this.clipRect = CLOUD.Extensions.Utils.Shape2D.createSvgElement('rect');
    this.clipRect.removeAttribute('pointer-events');
    this.clipPath.appendChild(this.clipRect);
    this.shape = CLOUD.Extensions.Utils.Shape2D.createSvgElement('text');
    this.backgroundRect = CLOUD.Extensions.Utils.Shape2D.createSvgElement('rect');
};
CLOUD.Extensions.AnnotationText.prototype.set = function (position, size, rotation, textString) {
    this.position.x = position.x;
    this.position.y = position.y;
    this.position.z = position.z;
    this.size.width = size.width;
    this.size.height = size.height;
    this.rotation = rotation;
    this.setText(textString);
};
CLOUD.Extensions.AnnotationText.prototype.resetSize = function (size, position) {
    var clientSize = this.getClientSize();
    var isCalcLines = (Math.floor(clientSize.width) !== size.width);
    this.position.x = position.x;
    this.position.y = position.y;
    this.position.z = position.z;
    this.size.width = size.width;
    this.size.height = size.height;
    if (isCalcLines) {
        var newLines = this.calcTextLines();
        if (!this.linesEqual(newLines)) {
            this.currTextLines = newLines;
            this.textDirty = true;
            this.forceRedraw();
        }
    }
    this.update();
};
CLOUD.Extensions.AnnotationText.prototype.setText = function (text) {
    this.currText = text;
    this.currTextLines = this.calcTextLines();
    this.textDirty = true;
    this.show();
    this.update();
};
CLOUD.Extensions.AnnotationText.prototype.getText = function () {
    return this.currText;
};
CLOUD.Extensions.AnnotationText.prototype.setParent = function (parent) {
    var currParent = this.clipPath.parentNode;
    if (currParent) {
        currParent.removeChild(this.clipPath);
    }
    if (parent) {
        parent.appendChild(this.clipPath);
    }
    currParent = this.backgroundRect.parentNode;
    if (currParent) {
        currParent.removeChild(this.backgroundRect);
    }
    if (parent) {
        parent.appendChild(this.backgroundRect);
    }
    currParent = this.shape.parentNode;
    if (currParent) {
        currParent.removeChild(this.shape);
    }
    if (parent) {
        parent.appendChild(this.shape);
    }
};
CLOUD.Extensions.AnnotationText.prototype.update = function (forceDirty) {
    var fontSize = this.style['font-size'];
    var strokeColor = this.highlighted ? this.highlightColor : this.style['stroke-color'];
    var strokeOpacity = this.style['stroke-opacity'];
    var fillColor = this.style['fill-color'];
    var fillOpacity = this.style['fill-opacity'];
    var position = this.getClientPosition();
    var size = this.getClientSize();
    var offsetX = size.width * 0.5;
    var offsetY = size.height * 0.5;
    this.transformShape = [
        'translate(', position.x, ',', position.y, ') ',
        'rotate(', THREE.Math.radToDeg(this.rotation), ') ',
        'translate(', -offsetX, ',', -offsetY, ') '
    ].join('');
    this.shape.setAttribute("font-family", this.style['font-family']);
    this.shape.setAttribute("font-size", fontSize);
    this.shape.setAttribute('font-weight', this.style['font-weight']);
    this.shape.setAttribute("font-style", this.style['font-style']);
    this.shape.setAttribute("fill", CLOUD.Extensions.Utils.Shape2D.getRGBAString(strokeColor, strokeOpacity));
    //var bBox = this.shape.getBBox();
    var verticalTransform = ['translate(0, ', fontSize, ')'].join('');
    this.shape.setAttribute("transform", (this.transformShape + verticalTransform));
    //this.shape.setAttribute('clip-path', 'url(#' + this.clipPathId + ')');
    if (this.textDirty || forceDirty) {
        if (forceDirty) {
            this.currTextLines = this.calcTextLines();
        }
        this.rebuildTextSvg();
        this.textDirty = false;
    }
    var bBox = this.shape.getBBox();
    this.shapeBox = bBox;
    this.clipRect.setAttribute('x', "0");
    this.clipRect.setAttribute('y', bBox.y + '');
    this.clipRect.setAttribute('width', size.width);
    this.clipRect.setAttribute('height', size.height);
    verticalTransform = ['translate(0, ', size.height, ')'].join('');
    this.backgroundRect.setAttribute("transform", this.transformShape + verticalTransform);
    this.backgroundRect.setAttribute('width', size.width);
    this.backgroundRect.setAttribute('height', size.height);
    this.backgroundRect.setAttribute("stroke-width", '0');
    this.backgroundRect.setAttribute('fill', CLOUD.Extensions.Utils.Shape2D.getRGBAString(fillColor, fillOpacity));
};
CLOUD.Extensions.AnnotationText.prototype.show = function () {
    if (this.shape.style.display !== "") {
        this.shape.style.display = "";
    }
};
CLOUD.Extensions.AnnotationText.prototype.hide = function () {
    if (this.shape.style.display !== "none") {
        this.shape.style.display = "none";
    }
};
CLOUD.Extensions.AnnotationText.prototype.forceRedraw = function () {
    window.requestAnimationFrame(function () {
        this.highlighted = !this.highlighted;
        this.update();
        this.highlighted = !this.highlighted;
        this.update();
    }.bind(this));
};
CLOUD.Extensions.AnnotationText.prototype.rebuildTextSvg = function () {
    while (this.shape.childNodes.length > 0) {
        this.shape.removeChild(this.shape.childNodes[0]);
    }
    var dx = 0;
    var dy = 0;
    var yOffset = this.getLineHeight();
    this.currTextLines.forEach(function (line) {
        var tspan = CLOUD.Extensions.Utils.Shape2D.createSvgElement('tspan');
        tspan.setAttribute('x', dx);
        tspan.setAttribute('y', dy);
        tspan.textContent = line;
        this.shape.appendChild(tspan);
        dy += yOffset;
    }.bind(this));
};
CLOUD.Extensions.AnnotationText.prototype.getLineHeight = function () {
    return this.style['font-size'] * (this.lineHeight * 0.01);
};
// CLOUD.Extensions.AnnotationText.prototype.calcTextLines = function () {
//
//     var textValues = this.editor.annotationTextArea.getTextValuesByAnnotation(this);
//     return textValues.lines;
// };
CLOUD.Extensions.AnnotationText.prototype.calcTextLines = function () {
    var textArea = this.editor.getTextArea();
    var textValues = textArea.getTextValuesByAnnotation(this);
    return textValues.lines;
};
CLOUD.Extensions.AnnotationText.prototype.getTextLines = function () {
    return this.currTextLines.concat();
};
CLOUD.Extensions.AnnotationText.prototype.linesEqual = function (lines) {
    var curr = this.currTextLines;
    if (lines.length !== curr.length)
        return false;
    var len = curr.length;
    for (var i = 0; i < len; ++i) {
        if (lines[i] !== curr[i])
            return false;
    }
    return true;
};
CLOUD.Extensions.AnnotationText.prototype.renderToCanvas = function (ctx) {
    function renderTextLines(ctx, lines, lineHeight, maxHeight) {
        var y = 0;
        lines.forEach(function (line) {
            if ((y + lineHeight) > maxHeight) {
                return;
            }
            ctx.fillText(line, 0, y);
            y += lineHeight;
        });
    }
    
    var fillColor = this.style['fill-color'];
    var fillOpacity = this.style['fill-opacity'];
    var strokeColor = this.style['stroke-color'];
    var fontOpacity = this.style['stroke-opacity'];
    var fontFamily = this.style['font-family'];
    var fontStyle = this.style['font-style'];
    var fontWeight = this.style['font-weight'];
    var fontSize = this.style['font-size'];
    var lineHeight = fontSize * (this.lineHeight * 0.01);
    var position = this.getClientPosition();
    var size = this.getClientSize();
    // 对应超出文本区域的文字的处理：使用包围盒
    //var bBox = this.shape.getBBox();
    var sizeBox = {width: this.shapeBox.width, height: this.shapeBox.height};
    ctx.save();
    ctx.fillStyle = CLOUD.Extensions.Utils.Shape2D.getRGBAString(fillColor, fillOpacity);
    ctx.translate(position.x, position.y);
    if (fillOpacity !== 0) {
        ctx.fillRect(-0.5 * sizeBox.width, -0.5 * sizeBox.height, sizeBox.width, sizeBox.height);
    }
    ctx.restore();
    // Text
    ctx.fillStyle = strokeColor;
    ctx.strokeStyle = strokeColor;
    ctx.textBaseline = 'top';
    ctx.translate(position.x, position.y);
    ctx.rotate(this.rotation);
    ctx.translate(-0.5 * size.width, -0.5 * size.height);
    ctx.font = fontStyle + " " + fontWeight + " " + fontSize + "px " + fontFamily;
    ctx.globalAlpha = fontOpacity;
    renderTextLines(ctx, this.currTextLines, lineHeight, sizeBox.height);
};
CLOUD.Extensions.AnnotationTextArea = function (editor, container) {
    this.editor = editor;
    this.container = container;
    this.textArea = document.createElement('textarea');
    this.textArea.setAttribute('maxlength', '260');
    this.textAreaStyle = {};
    this.textAreaStyle['position'] = 'absolute';
    this.textAreaStyle['overflow-y'] = 'hidden';
    this.measurePanel = document.createElement('div');
    this.textAnnotation = null;
    this.onKeyDownBinded = this.onKeyDown.bind(this);
    this.onResizeBinded = this.onResize.bind(this);
    this.addDomEventListeners();
};
CLOUD.Extensions.AnnotationTextArea.prototype.addDomEventListeners = function () {
    this.textArea.addEventListener('keydown', this.onKeyDownBinded, false);
};
CLOUD.Extensions.AnnotationTextArea.prototype.removeDomEventListeners = function () {
    this.textArea.removeEventListener('keydown', this.onKeyDownBinded, false);
};
CLOUD.Extensions.AnnotationTextArea.prototype.onKeyDown = function () {
    var keyCode = event.keyCode;
    var shiftDown = event.shiftKey;
    // 回车键
    if (!shiftDown && keyCode === 13) {
        event.preventDefault();
        this.accept();
        this.editor.resetCurrentAnnotationText();
    }
};
CLOUD.Extensions.AnnotationTextArea.prototype.onResize = function () {
    window.requestAnimationFrame(function () {
        if (this.textAnnotation) {
            var text = this.textArea.value;
            this.style = null;
            this.init();
            this.textArea.value = text;
        }
    }.bind(this));
};
CLOUD.Extensions.AnnotationTextArea.prototype.destroy = function () {
    this.removeDomEventListeners();
    this.inactive();
};
CLOUD.Extensions.AnnotationTextArea.prototype.init = function () {
    var position = this.textAnnotation.getClientPosition();
    var size = this.textAnnotation.getClientSize();
    var left = Math.floor(position.x - size.width * 0.5 + 0.5);
    var top = Math.floor(position.y - size.height * 0.5 + 0.5);
    var lineHeightPercentage = this.textAnnotation.lineHeight + "%";
    this.textAreaStyle['line-height'] = lineHeightPercentage;
    this.setBound(left, top, size.width, size.height);
    this.setStyle(this.textAnnotation.getStyle());
    this.textArea.value = this.textAnnotation.getText();
};
CLOUD.Extensions.AnnotationTextArea.prototype.setBound = function (left, top, width, height) {
    if (left + width >= this.container.clientWidth) {
        left = this.container.clientWidth - (width + 10);
    }
    if (top + height >= this.container.clientHeight) {
        top = this.container.clientHeight - (height + 10);
    }
    this.textAreaStyle['left'] = left + 'px';
    this.textAreaStyle['top'] = top + 'px';
    this.textAreaStyle['width'] = width + 'px';
    this.textAreaStyle['height'] = height + 'px';
};
CLOUD.Extensions.AnnotationTextArea.prototype.setStyle = function (style) {
    if (this.style) {
        var width = parseFloat(this.textArea.style.width);
        var height = parseFloat(this.textArea.style.height);
        var left = parseFloat(this.textArea.style.left);
        var top = parseFloat(this.textArea.style.top);
        var position = {
            x: left + (width * 0.5),
            y: top + (height * 0.5)
        };
        this.setBound(
            position.x - width * 0.5,
            position.y - height * 0.5,
            width, height);
    }
    this.textAreaStyle['font-family'] = style['font-family'];
    this.textAreaStyle['font-size'] = style['font-size'] + 'px';
    this.textAreaStyle['font-weight'] = style['font-weight'];
    this.textAreaStyle['font-style'] = style['font-style'];
    this.textAreaStyle['color'] = style['stroke-color'];
    var styleStr = CLOUD.DomUtil.getStyleString(this.textAreaStyle);
    this.textArea.setAttribute('style', styleStr);
    this.style = CLOUD.DomUtil.cloneStyle(style);
};
CLOUD.Extensions.AnnotationTextArea.prototype.isActive = function () {
    return !!this.textAnnotation;
};
CLOUD.Extensions.AnnotationTextArea.prototype.active = function (annotation, firstEdit) {
    if (this.textAnnotation === annotation) {
        return;
    }
    this.inactive();
    this.container.appendChild(this.textArea);
    this.textAnnotation = annotation;
    this.firstEdit = firstEdit || false;
    this.init();
    window.addEventListener('resize', this.onResizeBinded);
    var textArea = this.textArea;
    window.requestAnimationFrame(function () {
        textArea.focus();
    });
};
CLOUD.Extensions.AnnotationTextArea.prototype.inactive = function () {
    window.removeEventListener('resize', this.onResizeBinded);
    if (this.textAnnotation) {
        this.textAnnotation = null;
        this.container.removeChild(this.textArea);
    }
    this.style = null;
};
CLOUD.Extensions.AnnotationTextArea.prototype.accept = function () {
    var left = parseFloat(this.textArea.style.left);
    var top = parseFloat(this.textArea.style.top);
    var width = parseFloat(this.textArea.style.width);
    var height = parseFloat(this.textArea.style.height);
    var textValues = this.getTextValues();
    var position = {
        x: left + (width * 0.5),
        y: top + (height * 0.5)
    };
    var data = {
        annotation: this.textAnnotation,
        firstEdit: this.firstEdit,
        style: this.style,
        position: position,
        width: width,
        height: height,
        text: textValues.text,
        lines: textValues.lines
    };
    this.editor.handleTextChange(data);
    this.inactive();
};
CLOUD.Extensions.AnnotationTextArea.prototype.getTextValuesByAnnotation = function (annotation) {
    this.active(annotation, false);
    var textValues = this.getTextValues();
    this.inactive();
    return textValues;
};
CLOUD.Extensions.AnnotationTextArea.prototype.getTextValues = function () {
    var text = this.textArea.value;
    return {
        text: text,
        lines: this.calcTextLines()
    };
};
CLOUD.Extensions.AnnotationTextArea.prototype.calcTextLines = function () {
    var text = this.textArea.value;
    var linesBreaks = text.split(/\r*\n/);
    var measureStyle = CLOUD.DomUtil.cloneStyle(this.textAreaStyle);
    CLOUD.DomUtil.removeStyleAttribute(measureStyle, ['top', 'left', 'width', 'height', 'overflow-y']);
    measureStyle['position'] = 'absolute';
    measureStyle['white-space'] = 'nowrap';
    measureStyle['float'] = 'left';
    measureStyle['visibility'] = 'hidden';
    this.measurePanel.setAttribute('style', CLOUD.DomUtil.getStyleString(measureStyle));
    this.container.appendChild(this.measurePanel);
    var maxLineLength = parseFloat(this.textArea.style.width);
    var lines = [];
    for (var i = 0, len = linesBreaks.length; i < len; ++i) {
        var line = CLOUD.DomUtil.trimRight(linesBreaks[i]);
        this.splitLine(line, maxLineLength, lines);
    }
    this.container.removeChild(this.measurePanel);
    return lines;
};
CLOUD.Extensions.AnnotationTextArea.prototype.getShorterLine = function (line) {
    var iLastSpace = line.lastIndexOf(' ');
    if (iLastSpace === -1) {
        return [line];
    }
    while (line.charAt(iLastSpace - 1) === ' ') {
        iLastSpace--;
    }
    var trailingWord = line.substr(iLastSpace);
    var shorterLine = line.substr(0, iLastSpace);
    return [shorterLine, trailingWord];
};
CLOUD.Extensions.AnnotationTextArea.prototype.splitWord = function (word, remaining, maxLength, output) {
    var lenSoFar = 1;
    var fits = true;
    while (fits) {
        var part = word.substr(0, lenSoFar);
        this.measurePanel.innerHTML = part;
        var lineLen = this.measurePanel.clientWidth;
        if (lineLen > maxLength) {
            if (lenSoFar === 1) {
                output.push(part);
                this.splitWord(word.substr(1), remaining, maxLength, output);
                return;
            }
            var okayWord = word.substr(0, lenSoFar - 1);
            output.push(okayWord);
            var extraWord = word.substr(lenSoFar - 1);
            this.splitLine(extraWord + remaining, maxLength, output);
            return;
        }
        lenSoFar++;
        if (lenSoFar > word.length) {
            output.push(word);
            return;
        }
    }
};
CLOUD.Extensions.AnnotationTextArea.prototype.splitLine = function (text, maxLength, output) {
    if (text === '') {
        return;
    }
    var remaining = '';
    var done = false;
    while (!done) {
        this.measurePanel.innerHTML = text;
        var lineLen = this.measurePanel.clientWidth;
        if (lineLen <= maxLength) {
            output.push(text);
            this.splitLine(CLOUD.DomUtil.trimLeft(remaining), maxLength, output);
            done = true;
        } else {
            var parts = this.getShorterLine(text);
            if (parts.length === 1) {
                this.splitWord(text, remaining, maxLength, output);
                done = true;
            } else {
                text = parts[0];
                remaining = parts[1] + remaining;
            }
        }
    }
};
CLOUD.Extensions.AnnotationPopupTextArea = function (editor, container, popupCallback) {
    this.editor = editor;
    this.container = container;
    this.measurePanel = document.createElement('div');
    this.textAnnotation = null;
    this.popupCallback = popupCallback;
    this.initialText = "";
    this._resetTextAreaStyle();
};
CLOUD.Extensions.AnnotationPopupTextArea.prototype._setStyle = function (style) {
    var position = this.textAnnotation.getClientPosition();
    var size = this.textAnnotation.getClientSize();
    var left = Math.floor(position.x - size.width * 0.5 + 0.5);
    var top = Math.floor(position.y - size.height * 0.5 + 0.5);
    var width = size.width;
    var height = size.height;
    var fontSize = style['font-size']; // lineHeight = fontSize
    var modulo;
    if (left + width >= this.container.clientWidth) {
        width = this.container.clientWidth - left;
        modulo = width % fontSize;
        if (modulo !== 0) {
            width -= modulo;
        }
        // left = Math.floor(position.x - width * 0.5 + 0.5);
    }
    if (top + height >= this.container.clientHeight) {
        height = this.container.clientHeight - top;
        modulo = height % fontSize;
        if (modulo !== 0) {
            height -= modulo;
        }
        // top = Math.floor(position.y - height * 0.5 + 0.5);
    }
    this.textAreaStyle['left'] = left + 'px';
    this.textAreaStyle['top'] = top + 'px';
    this.textAreaStyle['width'] = width + 'px';
    this.textAreaStyle['height'] = height + 'px';
    this.textAreaStyle['font-family'] = style['font-family'];
    this.textAreaStyle['font-size'] = style['font-size'] + 'px';
    this.textAreaStyle['font-weight'] = style['font-weight'];
    this.textAreaStyle['font-style'] = style['font-style'];
    this.textAreaStyle['color'] = style['stroke-color'];
};
CLOUD.Extensions.AnnotationPopupTextArea.prototype._getTextValues = function () {
    var text = this.textAnnotation.getText();
    return {
        text: text,
        lines: this._calcTextLines(text)
    };
};
CLOUD.Extensions.AnnotationPopupTextArea.prototype._calcTextLines = function (text) {
    var linesBreaks = text.split(/\r*\n/);
    var container = this.container;
    var measureStyle = CLOUD.DomUtil.cloneStyle(this.textAreaStyle);
    CLOUD.DomUtil.removeStyleAttribute(measureStyle, ['top', 'left', 'width', 'height', 'overflow-y']);
    measureStyle['position'] = 'absolute';
    measureStyle['white-space'] = 'nowrap';
    measureStyle['float'] = 'left';
    measureStyle['visibility'] = 'hidden';
    this.measurePanel.setAttribute('style', CLOUD.DomUtil.getStyleString(measureStyle));
    container.appendChild(this.measurePanel);
    var maxLineLength = parseFloat(this.textAreaStyle.width);
    var lines = [];
    for (var i = 0, len = linesBreaks.length; i < len; ++i) {
        var line = CLOUD.DomUtil.trimRight(linesBreaks[i]);
        this._splitTextLine(line, maxLineLength, lines);
    }
    container.removeChild(this.measurePanel);
    return lines;
};
CLOUD.Extensions.AnnotationPopupTextArea.prototype._getShorterTextLine = function (line) {
    var iLastSpace = line.lastIndexOf(' ');
    if (iLastSpace === -1) {
        return [line];
    }
    while (line.charAt(iLastSpace - 1) === ' ') {
        iLastSpace--;
    }
    var trailingWord = line.substr(iLastSpace);
    var shorterLine = line.substr(0, iLastSpace);
    return [shorterLine, trailingWord];
};
CLOUD.Extensions.AnnotationPopupTextArea.prototype._splitWord = function (word, remaining, maxLength, output) {
    var lenSoFar = 1;
    var fits = true;
    while (fits) {
        var part = word.substr(0, lenSoFar);
        this.measurePanel.innerHTML = part;
        var lineLen = this.measurePanel.clientWidth;
        if (lineLen > maxLength) {
            if (lenSoFar === 1) {
                output.push(part);
                this._splitWord(word.substr(1), remaining, maxLength, output);
                return;
            }
            var okayWord = word.substr(0, lenSoFar - 1);
            output.push(okayWord);
            var extraWord = word.substr(lenSoFar - 1);
            this._splitTextLine(extraWord + remaining, maxLength, output);
            return;
        }
        lenSoFar++;
        if (lenSoFar > word.length) {
            output.push(word);
            return;
        }
    }
};
CLOUD.Extensions.AnnotationPopupTextArea.prototype._splitTextLine = function (text, maxLength, output) {
    if (text === '') {
        return;
    }
    var remaining = '';
    var done = false;
    var measurePanel = this.measurePanel;
    while (!done) {
        measurePanel.innerHTML = text;
        var lineLen = measurePanel.clientWidth;
        if (lineLen <= maxLength) {
            output.push(text);
            this._splitTextLine(CLOUD.DomUtil.trimLeft(remaining), maxLength, output);
            done = true;
        } else {
            var parts = this._getShorterTextLine(text);
            if (parts.length === 1) {
                this._splitWord(text, remaining, maxLength, output);
                done = true;
            } else {
                text = parts[0];
                remaining = parts[1] + remaining;
            }
        }
    }
};
CLOUD.Extensions.AnnotationPopupTextArea.prototype._resetTextAreaStyle = function () {
    this.textAreaStyle = {};
    this.textAreaStyle['position'] = 'absolute';
    this.textAreaStyle['overflow-y'] = 'hidden';
};
CLOUD.Extensions.AnnotationPopupTextArea.prototype.destroy = function () {
    this.inactive();
    this.editor = null;
    this.container = null;
    this.measurePanel = null;
    this.popupCallback = null;
};
CLOUD.Extensions.AnnotationPopupTextArea.prototype.isActive = function () {
    return !!this.textAnnotation;
};
CLOUD.Extensions.AnnotationPopupTextArea.prototype.active = function (annotation, popup) {
    this.inactive();
    this.textAnnotation = annotation;
    if (popup && this.popupCallback) {
        this._setStyle(this.textAnnotation.getStyle());
        this.initialText = this.textAnnotation.getText();
        var text = this.initialText;
        this.popupCallback(text);
    }
};
CLOUD.Extensions.AnnotationPopupTextArea.prototype.inactive = function () {
    if (this.textAnnotation) {
        this.textAnnotation = null;
    }
    // this._resetTextAreaStyle();
};
CLOUD.Extensions.AnnotationPopupTextArea.prototype.accept = function (text) {
    var textAreaStyle = this.textAreaStyle;
    var left = parseFloat(textAreaStyle.left);
    var top = parseFloat(textAreaStyle.top);
    var width = parseFloat(textAreaStyle.width);
    var height = parseFloat(textAreaStyle.height);
    var textLines = this._calcTextLines(text);
    var position = {
        x: left + (width * 0.5),
        y: top + (height * 0.5)
    };
    var data = {
        annotation: this.textAnnotation,
        position: position,
        width: width,
        height: height,
        text: text,
        lines: textLines
    };
    this.editor.handleTextChange(data);
    this.inactive();
    this._resetTextAreaStyle();
};
CLOUD.Extensions.AnnotationPopupTextArea.prototype.unaccept = function () {
    var text = this.initialText;
    this.accept(text);
};
CLOUD.Extensions.AnnotationPopupTextArea.prototype.getTextValuesByAnnotation = function (annotation) {
    this.active(annotation, false);
    var textValues = this._getTextValues();
    this.inactive();
    return textValues;
};
CLOUD.Extensions.AnnotationFrame = function (editor, container) {
    this.editor = editor;
    this.container = container;
    this.selection = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        rotation: 0,
        element: null,
        active: false,
        dragging: false,
        resizing: false,
        handle: {}
    };
    this.annotation = null;
    this.onResizeDownBinded = this.onResizeDown.bind(this);
    this.onDoubleClickBinded = this.onDoubleClick.bind(this);
    this.onRepositionDownBinded = this.onRepositionDown.bind(this);
    this.onRotationDownBinded = this.onRotationDown.bind(this);
    this.createFramePanel();
    this.addDomEventListeners();
};
CLOUD.Extensions.AnnotationFrame.prototype.addDomEventListeners = function () {
    this.framePanel.addEventListener('mousedown', this.onResizeDownBinded);
    this.framePanel.addEventListener('dblclick', this.onDoubleClickBinded);
    this.selection.element.addEventListener('mousedown', this.onRepositionDownBinded);
    this.selection.element.addEventListener('mousedown', this.onRotationDownBinded);
};
CLOUD.Extensions.AnnotationFrame.prototype.removeDomEventListeners = function () {
    this.framePanel.removeEventListener('mousedown', this.onResizeDownBinded);
    this.framePanel.removeEventListener('dblclick', this.onDoubleClickBinded);
    this.selection.element.removeEventListener('mousedown', this.onRepositionDownBinded);
    this.selection.element.removeEventListener('mousedown', this.onRotationDownBinded);
};
CLOUD.Extensions.AnnotationFrame.prototype.onMouseMove = function (event) {
};
CLOUD.Extensions.AnnotationFrame.prototype.onMouseUp = function (event) {
};
CLOUD.Extensions.AnnotationFrame.prototype.onRepositionDown = function (event) {
    if (!this.annotation) return;
    if (this.isDragPoint(event.target) || this.isRotatePoint(event.target)) return;
    this.selection.dragging = true;
    this.originMouse = this.editor.getPointOnDomContainer(event.clientX, event.clientY);
    this.originPosition = this.annotation.getClientPosition();
    this.onMouseMove = this.onRepositionMove.bind(this);
    this.onMouseUp = this.onRepositionUp.bind(this);
    this.editor.dragAnnotationFrameBegin();
};
CLOUD.Extensions.AnnotationFrame.prototype.onRepositionMove = function (event) {
    if (!this.annotation) return;
    if (!this.selection.dragging) return;
    var mouse = this.editor.getPointOnDomContainer(event.clientX, event.clientY);
    var movement = {
        x: mouse.x - this.originMouse.x,
        y: mouse.y - this.originMouse.y
    };
    var x = this.originPosition.x + movement.x;
    var y = this.originPosition.y + movement.y;
    this.updatePosition(x, y, this.selection.rotation);
    var position = this.editor.getAnnotationWorldPosition({x: x, y: y});
    this.annotation.resetPosition(position);
};
CLOUD.Extensions.AnnotationFrame.prototype.onRepositionUp = function () {
    this.onMouseMove = function () {
    };
    this.onMouseUp = function () {
    };
    if (!this.selection.dragging) {
        return;
    }
    this.selection.dragging = false;
    this.editor.dragAnnotationFrameEnd();
};
CLOUD.Extensions.AnnotationFrame.prototype.onResizeDown = function (event) {
    if (!this.annotation) return;
    var target = event.target;
    if (this.isDragPoint(target)) {
        this.selection.resizing = true;
        this.selection.handle.resizingPanel = target;
        var direction = this.selection.handle.resizingPanel.getAttribute('data-drag-point');
        this.container.style.cursor = direction + '-resize';
        var mouse = this.editor.getPointOnDomContainer(event.clientX, event.clientY);
        var position = this.annotation.getClientPosition();
        var size = this.annotation.getClientSize();
        this.origin = {
            x: position.x,
            y: position.y,
            width: size.width,
            height: size.height,
            mouseX: mouse.x,
            mouseY: mouse.y
        };
        this.onMouseMove = this.onResizeMove.bind(this);
        this.onMouseUp = this.onResizeUp.bind(this);
        this.editor.dragAnnotationFrameBegin();
    }
};
CLOUD.Extensions.AnnotationFrame.prototype.onResizeMove = function (event) {
    if (!this.annotation) return;
    if (!this.selection.resizing) return;
    var mouse = this.editor.getPointOnDomContainer(event.clientX, event.clientY);
    var origin = this.origin;
    var movement = {
        x: mouse.x - origin.mouseX,
        y: mouse.y - origin.mouseY
    };
    var vMovement = new THREE.Vector3(movement.x, movement.y, 0);
    var matRotation = new THREE.Matrix4().makeRotationZ(-this.selection.rotation);
    movement = vMovement.applyMatrix4(matRotation);
    var x = origin.x,
        y = origin.y,
        width = origin.width,
        height = origin.height;
    var translationDelta = new THREE.Vector3();
    var direction = this.selection.handle.resizingPanel.getAttribute('data-drag-point');
    var translations = {
        n: function () {
            height -= movement.y;
            translationDelta.y = movement.y;
        },
        s: function () {
            height += movement.y;
            translationDelta.y = movement.y;
        },
        w: function () {
            width -= movement.x;
            translationDelta.x = movement.x;
        },
        e: function () {
            width += movement.x;
            translationDelta.x = movement.x;
        },
        nw: function () {
            this.n();
            this.w();
        },
        ne: function () {
            this.n();
            this.e();
        },
        sw: function () {
            this.s();
            this.w();
        },
        se: function () {
            this.s();
            this.e();
        }
    };
    translations[direction]();
    var matRedoRotation = new THREE.Matrix4().makeRotationZ(this.selection.rotation);
    var actualDelta = translationDelta.applyMatrix4(matRedoRotation);
    var clientPosition = {x: x + (actualDelta.x * 0.5), y: y + (actualDelta.y * 0.5)};
    var clientSize = {width: width, height: height};
    var newPosition = this.editor.getAnnotationWorldPosition(clientPosition);
    var size = this.editor.getAnnotationWorldSize(clientSize, clientPosition);
    this.annotation.resetSize(size, newPosition);
};
CLOUD.Extensions.AnnotationFrame.prototype.onResizeUp = function (event) {
    this.onMouseMove = function () {
    };
    this.onMouseUp = function () {
    };
    this.selection.resizing = false;
    this.selection.handle.resizingPanel = null;
    this.container.style.cursor = '';
    this.editor.dragAnnotationFrameEnd();
};
CLOUD.Extensions.AnnotationFrame.prototype.onRotationDown = function (event) {
    if (!this.annotation) return;
    if (!this.isRotatePoint(event.target)) return;
    this.selection.rotating = true;
    this.originPosition = this.editor.getPointOnDomContainer(event.clientX, event.clientY);
    this.originRotation = this.selection.rotation || 0;
    this.onMouseMove = this.onRotationMove.bind(this);
    this.onMouseUp = this.onRotationUp.bind(this);
    this.editor.dragAnnotationFrameBegin();
};
CLOUD.Extensions.AnnotationFrame.prototype.onRotationMove = function (event) {
    if (!this.annotation) return;
    if (!this.selection.rotating) return;
    var mouse = this.editor.getPointOnDomContainer(event.clientX, event.clientY);
    var position = this.annotation.getClientPosition();
    var angle1 = CLOUD.Extensions.Utils.Geometric.getAngleBetweenPoints(position, mouse);
    var angle2 = CLOUD.Extensions.Utils.Geometric.getAngleBetweenPoints(position, this.originPosition);
    var rotation = angle1 - angle2 + this.originRotation;
    this.updatePosition(this.selection.x, this.selection.y, rotation);
    this.annotation.resetRotation(rotation);
};
CLOUD.Extensions.AnnotationFrame.prototype.onRotationUp = function (event) {
    this.onMouseMove = function () {
    };
    this.onMouseUp = function () {
    };
    this.selection.rotating = false;
    this.originRotation = null;
    this.originPosition = null;
    this.editor.dragAnnotationFrameEnd();
};
CLOUD.Extensions.AnnotationFrame.prototype.onDoubleClick = function (event) {
    this.selection.dragging = false;
    if (this.annotation) {
        this.editor.onMouseDoubleClick(event, this.annotation);
    }
};
CLOUD.Extensions.AnnotationFrame.prototype.destroy = function () {
    this.removeDomEventListeners();
};
CLOUD.Extensions.AnnotationFrame.prototype.createFramePanel = function () {
    var scope = this;
    var createBoxWrapperPanel = function () {
        var panel = document.createElement('div');
        panel.style.position = 'absolute';
        panel.style.top = 0;
        panel.style.bottom = 0;
        panel.style.left = 0;
        panel.style.right = 0;
        panel.style.overflow = 'hidden';
        panel.style.visibility = 'hidden';
        panel.style.pointerEvents = 'none';
        return panel;
    };
    var createRotatePointPanel = function (diameter) {
        var borderWidth = 2;
        var borderRadius = (diameter / 2) + borderWidth;
        var panel = document.createElement('div');
        panel.style.position = 'absolute';
        panel.style.backgroundColor = 'aqua';
        panel.style.border = borderWidth + 'px solid rgb(95, 98, 100)';
        panel.style.height = diameter + 'px';
        panel.style.width = diameter + 'px';
        panel.style.borderRadius = borderRadius + 'px';
        panel.style.boxSizing = 'border-box';
        panel.classList.add('select-rotate-point');
        panel.style.top = '-25px';
        panel.style.left = '50%';
        panel.style.transform = 'translate3d(-50%, 0px, 0px)';
        return panel;
    };
    var createDragBoxPanel = function () {
        var borderWidth = 1;
        var borderColor = 'rgb(0, 0, 255)';
        var panel = document.createElement('div');
        panel.style.position = 'absolute';
        panel.style.border = borderWidth + 'px solid ' + borderColor;
        panel.style.zIndex = 1;
        panel.style.cursor = 'move';
        panel.style.boxSizing = 'border-box';
        panel.style.pointerEvents = 'auto';
        panel.classList.add('drag-box');
        return panel;
    };
    var createDragPointPanel = function (diameter, position) {
        var borderWidth = 2;
        var placementOffset = -1 * ((diameter + borderWidth) / 2);
        var wrapperPanel;
        var dragPointPanel = document.createElement('div');
        dragPointPanel.style.position = 'absolute';
        dragPointPanel.style.backgroundColor = 'rgba(151, 151, 151, 1)';
        dragPointPanel.style.border = borderWidth + 'px solid rgb(95, 98, 100)';
        dragPointPanel.style.height = diameter + 'px';
        dragPointPanel.style.width = diameter + 'px';
        dragPointPanel.style.borderRadius = (diameter / 2) + borderWidth + 'px';
        dragPointPanel.style.boxSizing = 'border-box';
        CLOUD.DomUtil.setCursorStyle(dragPointPanel, position);
        dragPointPanel.className = 'select-drag-point drag-point-' + position;
        dragPointPanel.setAttribute('data-drag-point', position);
        switch (position) {
            case 'n':
                wrapperPanel = document.createElement('div');
                wrapperPanel.style.position = 'absolute';
                wrapperPanel.style.width = '100%';
                wrapperPanel.style.height = diameter + 'px';
                wrapperPanel.style.top = placementOffset + 'px';
                dragPointPanel.style.margin = '0 auto';
                dragPointPanel.style.position = '';
                wrapperPanel.appendChild(dragPointPanel);
                dragPointPanel = wrapperPanel;
                break;
            case 's':
                wrapperPanel = document.createElement('div');
                wrapperPanel.style.position = 'absolute';
                wrapperPanel.style.width = '100%';
                wrapperPanel.style.height = diameter + 'px';
                wrapperPanel.style.bottom = placementOffset + 'px';
                dragPointPanel.style.margin = '0 auto';
                dragPointPanel.style.position = '';
                wrapperPanel.appendChild(dragPointPanel);
                dragPointPanel = wrapperPanel;
                break;
            case 'w':
                dragPointPanel.style.left = placementOffset + 'px';
                dragPointPanel.style.top = '50%';
                dragPointPanel.style.transform = 'translate3d(0, -50%, 0)';
                break;
            case 'e':
                dragPointPanel.style.right = placementOffset + 'px';
                dragPointPanel.style.top = '50%';
                dragPointPanel.style.transform = 'translate3d(0, -50%, 0)';
                break;
            case 'nw':
                dragPointPanel.style.top = placementOffset + 'px';
                dragPointPanel.style.left = placementOffset + 'px';
                break;
            case 'ne':
                dragPointPanel.style.top = placementOffset + 'px';
                dragPointPanel.style.right = placementOffset + 'px';
                break;
            case 'sw':
                dragPointPanel.style.bottom = placementOffset + 'px';
                dragPointPanel.style.left = placementOffset + 'px';
                break;
            case 'se':
                dragPointPanel.style.bottom = placementOffset + 'px';
                dragPointPanel.style.right = placementOffset + 'px';
                break;
        }
        return dragPointPanel;
    };
    var createDragPointPanels = function (selector) {
        var diameter = 12;
        var directions = ['n', 's', 'w', 'e', 'nw', 'ne', 'sw', 'se'];
        directions.forEach(function (direction) {
            scope.selection.handle[direction] = createDragPointPanel(diameter, direction);
            selector.appendChild(scope.selection.handle[direction]);
        });
    };
    this.framePanel = createBoxWrapperPanel();
    this.container.appendChild(this.framePanel);
    var dragBoxPanel = createDragBoxPanel();
    createDragPointPanels(dragBoxPanel);
    this.selection.element = dragBoxPanel;
    this.framePanel.appendChild(this.selection.element);
    this.selection.rotationPanel = createRotatePointPanel(12);
    dragBoxPanel.appendChild(this.selection.rotationPanel);
    this.updateState(false);
};
CLOUD.Extensions.AnnotationFrame.prototype.setSelection = function (x, y, width, height, rotation) {
    this.updateDimensions(width, height);
    this.updatePosition(x, y, rotation);
    this.updateState(true);
    this.framePanel.style.visibility = 'visible';
};
CLOUD.Extensions.AnnotationFrame.prototype.setAnnotation = function (annotation) {
    if (!annotation) {
        if (this.annotation) {
            this.annotation = null;
            this.updateState(false);
        }
        return;
    }
    var size = annotation.getClientSize();
    var position = annotation.getClientPosition();
    var rotation = annotation.rotation;
    this.annotation = annotation;
    this.setSelection(position.x - (size.width / 2), position.y - (size.height / 2), size.width, size.height, rotation);
    this.enableResize();
    this.enableRotation();
};
CLOUD.Extensions.AnnotationFrame.prototype.isActive = function () {
    return this.isDragging() || this.isResizing() || this.isRotating();
};
CLOUD.Extensions.AnnotationFrame.prototype.dragBegin = function (event) {
    this.onRepositionDown(event);
};
CLOUD.Extensions.AnnotationFrame.prototype.isDragging = function () {
    return this.selection.dragging;
};
CLOUD.Extensions.AnnotationFrame.prototype.isResizing = function () {
    return this.selection.resizing;
};
CLOUD.Extensions.AnnotationFrame.prototype.isRotating = function () {
    return this.selection.rotating;
};
CLOUD.Extensions.AnnotationFrame.prototype.enableResize = function () {
    var handle, direction;
    if (this.annotation.disableResizeHeight || this.annotation.disableResizeWidth) {
        for (direction in this.selection.handle) {
            handle = this.selection.handle[direction];
            if (handle) handle.style.display = 'none';
        }
        if (this.annotation.disableResizeHeight) {
            this.selection.handle['w'].style.display = 'block';
            this.selection.handle['e'].style.display = 'block';
        }
        if (this.annotation.disableResizeWidth) {
            this.selection.handle['n'].style.display = 'block';
            this.selection.handle['s'].style.display = 'block';
        }
    } else {
        for (direction in this.selection.handle) {
            handle = this.selection.handle[direction];
            if (handle) {
                handle.style.display = 'block';
            }
        }
    }
};
CLOUD.Extensions.AnnotationFrame.prototype.enableRotation = function () {
    var display = this.annotation.disableRotation ? 'none' : 'block';
    this.selection.rotationPanel.style.display = display;
};
CLOUD.Extensions.AnnotationFrame.prototype.updateDimensions = function (width, height) {
    this.selection.width = width;
    this.selection.height = height;
    this.selection.element.style.width = width + 'px';
    this.selection.element.style.height = height + 'px';
};
CLOUD.Extensions.AnnotationFrame.prototype.updatePosition = function (x, y, rotation) {
    var size = this.annotation.getClientSize();
    this.selection.x = x;
    this.selection.y = y;
    this.selection.rotation = rotation;
    this.selection.element.style.msTransform = CLOUD.DomUtil.toTranslate3d(x, y) + ' rotate(' + rotation + 'rad)';
    this.selection.element.style.msTransformOrigin = (size.width / 2) + 'px ' + (size.height / 2) + 'px';
    this.selection.element.style.webkitTransform = CLOUD.DomUtil.toTranslate3d(x, y) + ' rotate(' + rotation + 'rad)';
    this.selection.element.style.webkitTransformOrigin = (size.width / 2) + 'px ' + (size.height / 2) + 'px';
    this.selection.element.style.transform = CLOUD.DomUtil.toTranslate3d(x, y) + ' rotate(' + rotation + 'rad)';
    this.selection.element.style.transformOrigin = (size.width / 2) + 'px ' + (size.height / 2) + 'px';
};
CLOUD.Extensions.AnnotationFrame.prototype.updateState = function (active) {
    this.selection.active = active;
    this.selection.element.style.display = active ? 'block' : 'none';
};
CLOUD.Extensions.AnnotationFrame.prototype.isDragPoint = function (element) {
    return CLOUD.DomUtil.matchesSelector(element, '.select-drag-point');
};
CLOUD.Extensions.AnnotationFrame.prototype.isRotatePoint = function (element) {
    return CLOUD.DomUtil.matchesSelector(element, '.select-rotate-point');
};
var CLOUD = CLOUD || {};
CLOUD.Extensions = CLOUD.Extensions || {};
CLOUD.Extensions.AnnotationEditor = function (domElement, options) {
    "use strict";
    this.domElement = domElement;
    this.annotations = [];
    this.selectedAnnotation = null;
    this.bounds = {x: 0, y: 0, width: 0, height: 0};
    this.keys = {
        BACKSPACE: 8,
        ALT: 18,
        ESC: 27,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        BOTTOM: 40,
        DELETE: 46,
        ZERO: 48,
        A: 65,
        D: 68,
        E: 69,
        Q: 81,
        S: 83,
        W: 87,
        PLUS: 187,
        SUB: 189
    };
    this.isEditing = false;
    this.originX = 0;
    this.originY = 0;
    this.isCreating = false;
    this.beginEditCallback = null;
    this.endEditCallback = null;
    this.changeEditorModeCallback = null;
    this.annotationType = CLOUD.Extensions.Annotation.shapeTypes.ARROW;
    this.nextAnnotationId = 0;
    this.annotationMinLen = 16;
    this.initialized = false;
    this.epsilon = 0.0001;
    this.annotationStyle = null;
    this.isDblClickCloseCloud = true;
    this.mouseButtons = {LEFT: 0, MIDDLE: 1, RIGHT: 2};
    this.onContextMenuBinded = this.onContextMenu.bind(this);
    this.onMouseDownBinded = this.onMouseDown.bind(this);
    this.onMouseDoubleClickBinded = this.onMouseDoubleClick.bind(this);
    this.onMouseMoveBinded = this.onMouseMove.bind(this);
    this.onMouseUpBinded = this.onMouseUp.bind(this);
    this.onKeyDownBinded = this.onKeyDown.bind(this);
    this.onKeyUpBinded = this.onKeyUp.bind(this);
    this.onTouchStartBinded = this.onTouchStart.bind(this);
    this.onTouchMoveBinded = this.onTouchMove.bind(this);
    this.onTouchEndBinded = this.onTouchEnd.bind(this);
    options = options || {};
    this.popupCallback = options.popupCallback;
    this.annotationTextArea = null;
    this.annotationPopupTextArea = null;
};
CLOUD.Extensions.AnnotationEditor.prototype.addDomEventListeners = function () {
    if (this.svg) {
        this.svg.addEventListener('mousedown', this.onMouseDownBinded, false);
        this.svg.addEventListener('touchstart', this.onTouchStartBinded, false);
        this.svg.addEventListener('dblclick', this.onMouseDoubleClickBinded, false);
        this.svg.addEventListener('contextmenu', this.onContextMenuBinded, false);
        window.addEventListener('mousemove', this.onMouseMoveBinded, false);
        window.addEventListener('mouseup', this.onMouseUpBinded, false);
        window.addEventListener('touchmove', this.onTouchMoveBinded, false);
        window.addEventListener('touchend', this.onTouchEndBinded, false);
        window.addEventListener('keydown', this.onKeyDownBinded, false);
        window.addEventListener('keyup', this.onKeyUpBinded, false);
        this.onFocus();
    }
};
CLOUD.Extensions.AnnotationEditor.prototype.removeDomEventListeners = function () {
    if (this.svg) {
        this.svg.removeEventListener('mousedown', this.onMouseDownBinded, false);
        this.svg.removeEventListener('touchstart', this.onTouchStartBinded, false);
        this.svg.removeEventListener('dblclick', this.onMouseDoubleClickBinded, false);
        this.svg.removeEventListener('contextmenu', this.onContextMenuBinded, false);
        window.removeEventListener('mousemove', this.onMouseMoveBinded, false);
        window.removeEventListener('mouseup', this.onMouseUpBinded, false);
        window.removeEventListener('touchmove', this.onTouchMoveBinded, false);
        window.removeEventListener('touchend', this.onTouchEndBinded, false);
        window.removeEventListener('keydown', this.onKeyDownBinded, false);
        window.removeEventListener('keyup', this.onKeyUpBinded, false);
    }
};
CLOUD.Extensions.AnnotationEditor.prototype.onFocus = function () {
    if (this.svg) {
        this.svg.focus();
    }
};
CLOUD.Extensions.AnnotationEditor.prototype.onContextMenu = function (event) {
    event.preventDefault();
};
CLOUD.Extensions.AnnotationEditor.prototype.onMouseDown = function (event) {
    event.preventDefault();
    event.stopPropagation();
    if (event.button === this.mouseButtons.LEFT) {
        if (this.annotationFrame.isActive()) {
            this.annotationFrame.setAnnotation(this.selectedAnnotation);
            return;
        }
        this.handleEvent(event, "down");
        if (!this.isCreating && event.target === this.svg) {
            this.selectAnnotation(null);
        }
    }
};
CLOUD.Extensions.AnnotationEditor.prototype.onMouseMove = function (event) {
    
    // mark: 对应注册到window上的事件，如果调用会取消事件的默认动作，导致document上其他元素（例如textarea)的行为出现问题（例如，鼠标移动无法选择文本）
    //event.preventDefault();
    event.stopPropagation();
    if (event.button === this.mouseButtons.LEFT) {
        if (this.annotationFrame.isActive()) {
            this.annotationFrame.onMouseMove(event);
            this.annotationFrame.setAnnotation(this.selectedAnnotation);
            return;
        }
        this.handleEvent(event, "move");
    }
};
CLOUD.Extensions.AnnotationEditor.prototype.onMouseUp = function (event) {
    
    // mark: 对应注册到window上的事件，如果调用会取消事件的默认动作，导致document上其他元素（例如textarea)的行为出现问题（例如，鼠标移动无法选择文本）
    //event.preventDefault();
    event.stopPropagation();
    // 批注编辑结束
    if (this.annotationFrame.isActive()) {
        this.annotationFrame.onMouseUp(event);
        return;
    }
    if (this.selectedAnnotation && this.isCreating) {
        this.handleEvent(event, "up");
    }
};
CLOUD.Extensions.AnnotationEditor.prototype.onTouchStart = function (event) {
    event.preventDefault();
    event.stopPropagation();
    if (event.touches.length == 1) {
        if (this.annotationFrame.isActive()) {
            this.annotationFrame.setAnnotation(this.selectedAnnotation);
            return;
        }
        this.handleEvent(event, "start");
        if (!this.isCreating && event.target === this.svg) {
            this.selectAnnotation(null);
        }
    }
};
CLOUD.Extensions.AnnotationEditor.prototype.onTouchMove = function (event) {
    
    // mark: 对应注册到window上的事件，如果调用会取消事件的默认动作，导致document上其他元素（例如textarea)的行为出现问题（例如，鼠标移动无法选择文本）
    //event.preventDefault();
    event.stopPropagation();
    if (event.touches.length == 1) {
        if (this.annotationFrame.isActive()) {
            this.annotationFrame.onTouchMove(event);
            this.annotationFrame.setAnnotation(this.selectedAnnotation);
            return;
        }
        this.handleEvent(event, "touchmove");
    }
};
CLOUD.Extensions.AnnotationEditor.prototype.onTouchEnd = function (event) {
    
    // mark: 对应注册到window上的事件，如果调用会取消事件的默认动作，导致document上其他元素（例如textarea)的行为出现问题（例如，鼠标移动无法选择文本）
    //event.preventDefault();
    event.stopPropagation();
    // 批注编辑结束
    if (this.annotationFrame.isActive()) {
        this.annotationFrame.onTouchEnd(event);
        return;
    }
    if (this.selectedAnnotation && this.isCreating) {
        this.handleEvent(event, "end");
    }
};
CLOUD.Extensions.AnnotationEditor.prototype.onMouseDoubleClick = function (event, annotation) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.isEditing) {
        return;
    }
    if (this.isDblClickCloseCloud) {
        this.mouseDoubleClickForCloud(event);
    }
    this.mouseDoubleClickForText(event, annotation);
};
CLOUD.Extensions.AnnotationEditor.prototype.onKeyDown = function (event) {
};
CLOUD.Extensions.AnnotationEditor.prototype.onKeyUp = function (event) {
    if (!this.isEditing) {
        return;
    }
    switch (event.keyCode) {
        case this.keys.DELETE:
            if (this.selectedAnnotation) {
                this.selectedAnnotation.delete();
                this.selectedAnnotation = null;
                this.deselectAnnotation();
            }
            break;
        case this.keys.ESC:
            
            // 结束云图绘制
            if (this.annotationType === CLOUD.Extensions.Annotation.shapeTypes.CLOUD) {
                
                // 结束云图绘制，不封闭云图
                this.selectedAnnotation.finishTrack();
                this.selectedAnnotation.setSeal(false);
                this.createAnnotationEnd();
                this.deselectAnnotation();
            }
            this.forceAnnotationTextComplete();
            break;
        default :
            break;
    }
};
CLOUD.Extensions.AnnotationEditor.prototype.onResize = function () {
    var bounds = this.getDomContainerBounds();
    this.bounds.x = 0;
    this.bounds.y = 0;
    this.bounds.width = bounds.width;
    this.bounds.height = bounds.height;
    this.svg.setAttribute('width', this.bounds.width + '');
    this.svg.setAttribute('height', this.bounds.height + '');
    this.updateAnnotations();
};
CLOUD.Extensions.AnnotationEditor.prototype.handleEvent = function (event, type) {
    var mode = this.annotationType;
    // 对文本批注的处理
    if ((type === "down" || type === "start") && this.forceAnnotationTextComplete()) {
        return;
    }
    switch (mode) {
        case CLOUD.Extensions.Annotation.shapeTypes.RECTANGLE:
            if (type === "down") {
                if (this.startRectangle(event.clientX, event.clientY)) {
                    this.createAnnotationBegin();
                }
            } else if (type === "start") {
                if (this.startRectangle(event.touches[0].clientX, event.touches[0].clientY)) {
                    this.createAnnotationBegin();
                }
            }
            else if (type === "move") {
                this.moveRectangle(event.clientX, event.clientY);
            } else if (type === "touchmove") {
                this.moveRectangle(event.touches[0].clientX, event.touches[0].clientY);
            }
            else if (type === "up" || type === "end") {
                this.createAnnotationEnd();
                this.deselectAnnotation();
            }
            break;
        case CLOUD.Extensions.Annotation.shapeTypes.CIRCLE:
            if (type === "down") {
                if (this.startCircle(event.clientX, event.clientY)) {
                    this.createAnnotationBegin();
                }
            } else if (type === "start") {
                if (this.startCircle(event.touches[0].clientX, event.touches[0].clientY)) {
                    this.createAnnotationBegin();
                }
            } else if (type === "move") {
                this.moveCircle(event.clientX, event.clientY);
            } else if (type === "touchmove") {
                this.moveCircle(event.touches[0].clientX, event.touches[0].clientY);
            } else if (type === "up" || type === "end") {
                //this.created()
                this.createAnnotationEnd();
                this.deselectAnnotation();
            }
            break;
        case CLOUD.Extensions.Annotation.shapeTypes.CROSS:
            if (type === "down") {
                if (this.startCross(event.clientX, event.clientY)) {
                    this.createAnnotationBegin();
                }
            } else if (type === "start") {
                if (this.startCross(event.touches[0].clientX, event.touches[0].clientY)) {
                    this.createAnnotationBegin();
                }
            } else if (type === "move") {
                this.moveCross(event.clientX, event.clientY);
            } else if (type === "touchmove") {
                this.moveCross(event.touches[0].clientX, event.touches[0].clientY);
            } else if (type === "up" || type === "end") {
                this.createAnnotationEnd();
                this.deselectAnnotation();
            }
            break;
        case CLOUD.Extensions.Annotation.shapeTypes.CLOUD:
            if (type === "down") {
                if (this.startCloud(event.clientX, event.clientY)) {
                    this.createAnnotationBegin();
                }
            } else if (type === "start") {
                if (this.startCloud(event.touches[0].clientX, event.touches[0].clientY)) {
                    this.createAnnotationBegin();
                }
            } else if (type === "move") {
                this.moveCloud(event.clientX, event.clientY);
            } else if (type === "touchmove") {
                this.moveCloud(event.touches[0].clientX, event.touches[0].clientY);
            } else if (type === "up" || type === "end") {
                this.endCloud(event, type);
            }
            break;
        case CLOUD.Extensions.Annotation.shapeTypes.TEXT:
            if (type === "down") {
                this.startText(event.clientX, event.clientY);
            } else if (type === "start") {
                this.startText(event.touches[0].clientX, event.touches[0].clientY);
            }
            break;
        case CLOUD.Extensions.Annotation.shapeTypes.ARROW:
        default :
            if (type === "down") {
                if (this.startArrow(event.clientX, event.clientY)) {
                    this.createAnnotationBegin();
                }
            } else if (type === "start") {
                if (this.startArrow(event.touches[0].clientX, event.touches[0].clientY)) {
                    this.createAnnotationBegin();
                }
            } else if (type === "move") {
                this.moveArrow(event.clientX, event.clientY);
            } else if (type === "touchmove") {
                this.moveArrow(event.touches[0].clientX, event.touches[0].clientY);
            } else if (type === "up" || type === "end") {
                this.createAnnotationEnd();
                this.deselectAnnotation();
            }
            break;
    }
};
CLOUD.Extensions.AnnotationEditor.prototype.startArrow = function (x, y) {
    if (this.selectedAnnotation) return false;
    var start = this.getPointOnDomContainer(x, y);
    this.originX = start.x;
    this.originY = start.y;
    var width = this.annotationMinLen;
    var tail = {x: this.originX, y: this.originY};
    var head = {
        x: Math.round(tail.x + Math.cos(Math.PI * 0.25) * width),
        y: Math.round(tail.y + Math.sin(-Math.PI * 0.25) * width)
    };
    var constrain = function (tail, head, width, bounds) {
        if (CLOUD.Extensions.Utils.Geometric.isInsideBounds(head.x, head.y, bounds)) {
            return;
        }
        head.y = Math.round(tail.y + Math.sin(Math.PI * 0.25) * width);
        if (CLOUD.Extensions.Utils.Geometric.isInsideBounds(head.x, head.y, bounds)) {
            return;
        }
        head.x = Math.round(tail.y + Math.cos(-Math.PI * 0.25) * width);
        if (CLOUD.Extensions.Utils.Geometric.isInsideBounds(head.x, head.y, bounds)) {
            return;
        }
        head.y = Math.round(tail.y + Math.sin(-Math.PI * 0.25) * width);
    };
    constrain(tail, head, width, this.getBounds());
    head = this.getAnnotationWorldPosition(head);
    tail = this.getAnnotationWorldPosition(tail);
    var arrowId = this.generateAnnotationId();
    var arrow = new CLOUD.Extensions.AnnotationArrow(this, arrowId);
    arrow.setByTailHead(tail, head);
    this.addAnnotation(arrow);
    arrow.created();
    this.selectedAnnotation = arrow;
    return true;
};
CLOUD.Extensions.AnnotationEditor.prototype.moveArrow = function (x, y) {
    if (!this.selectedAnnotation || !this.isCreating) {
        return;
    }
    var arrow = this.selectedAnnotation;
    var end = this.getPointOnDomContainer(x, y);
    var bounds = this.getBounds();
    var startX = this.originX;
    var startY = this.originY;
    var deltaX = end.x - startX;
    if (Math.abs(deltaX) < this.annotationMinLen) {
        if (deltaX > 0) {
            end.x = startX + this.annotationMinLen;
        } else {
            end.x = startX - this.annotationMinLen;
        }
    }
    var endX = Math.min(Math.max(bounds.x, end.x), bounds.x + bounds.width);
    var endY = Math.min(Math.max(bounds.y, end.y), bounds.y + bounds.height);
    if (endX === startX && endY === startY) {
        endX++;
        endY++;
    }
    var tail = {x: startX, y: startY};
    var head = {x: endX, y: endY};
    tail = this.getAnnotationWorldPosition(tail);
    head = this.getAnnotationWorldPosition(head);
    if (Math.abs(arrow.head.x - head.x) >= this.epsilon || Math.abs(arrow.head.y - head.y) >= this.epsilon ||
        Math.abs(arrow.tail.x - tail.x) >= this.epsilon || Math.abs(arrow.tail.y - tail.y) >= this.epsilon) {
        arrow.setByTailHead(tail, head);
    }
};
CLOUD.Extensions.AnnotationEditor.prototype.startRectangle = function (x, y) {
    if (this.selectedAnnotation) return false;
    var start = this.getPointOnDomContainer(x, y);
    var minLen = this.annotationMinLen;
    this.originX = start.x;
    this.originY = start.y;
    var clientPosition = {x: start.x, y: start.y};
    var clientSize = {width: minLen, height: minLen};
    var position = this.getAnnotationWorldPosition(clientPosition);
    var size = this.getAnnotationWorldSize(clientSize, clientPosition);
    var id = this.generateAnnotationId();
    var rectangle = new CLOUD.Extensions.AnnotationRectangle(this, id);
    rectangle.set(position, size, 0);
    this.addAnnotation(rectangle);
    rectangle.created();
    this.selectedAnnotation = rectangle;
    return true;
};
CLOUD.Extensions.AnnotationEditor.prototype.moveRectangle = function (x, y) {
    if (!this.selectedAnnotation || !this.isCreating) {
        return;
    }
    var rectangle = this.selectedAnnotation;
    var end = this.getPointOnDomContainer(x, y);
    var bounds = this.getBounds();
    var startX = this.originX;
    var startY = this.originY;
    var endX = Math.min(Math.max(bounds.x, end.x), bounds.x + bounds.width);
    var endY = Math.min(Math.max(bounds.y, end.y), bounds.y + bounds.height);
    if (endX === startX && endY === startY) {
        endX++;
        endY++;
    }
    var clientPosition = {x: (startX + endX) / 2, y: (startY + endY) / 2};
    var clientSize = {width: Math.abs(endX - startX), height: Math.abs(endY - startY)};
    var position = this.getAnnotationWorldPosition(clientPosition);
    var size = this.getAnnotationWorldSize(clientSize, clientPosition);
    if (Math.abs(rectangle.position.x - position.x) > this.epsilon || Math.abs(rectangle.size.y - size.y) > this.epsilon ||
        Math.abs(rectangle.position.y - position.y) > this.epsilon || Math.abs(rectangle.size.y - size.y) > this.epsilon) {
        rectangle.set(position, size);
    }
};
CLOUD.Extensions.AnnotationEditor.prototype.startCircle = function (x, y) {
    if (this.selectedAnnotation) return false;
    var start = this.getPointOnDomContainer(x, y);
    this.originX = start.x;
    this.originY = start.y;
    var minLen = this.annotationMinLen;
    var clientPosition = {x: start.x, y: start.y};
    var clientSize = {width: minLen, height: minLen};
    var position = this.getAnnotationWorldPosition(clientPosition);
    var size = this.getAnnotationWorldSize(clientSize, clientPosition);
    var id = this.generateAnnotationId();
    var circle = new CLOUD.Extensions.AnnotationCircle(this, id);
    circle.set(position, size, 0);
    this.addAnnotation(circle);
    circle.created();
    this.selectedAnnotation = circle;
    return true;
};
CLOUD.Extensions.AnnotationEditor.prototype.moveCircle = function (x, y) {
    if (!this.selectedAnnotation || !this.isCreating) {
        return;
    }
    var circle = this.selectedAnnotation;
    var end = this.getPointOnDomContainer(x, y);
    var bounds = this.getBounds();
    var startX = this.originX;
    var startY = this.originY;
    var endX = Math.min(Math.max(bounds.x, end.x), bounds.x + bounds.width);
    var endY = Math.min(Math.max(bounds.y, end.y), bounds.y + bounds.height);
    if (endX === startX && endY === startY) {
        endX++;
        endY++;
    }
    var clientPosition = {x: (startX + endX) / 2, y: (startY + endY) / 2};
    var clientSize = {width: Math.abs(endX - startX), height: Math.abs(endY - startY)};
    var position = this.getAnnotationWorldPosition(clientPosition);
    var size = this.getAnnotationWorldSize(clientSize, clientPosition);
    if (Math.abs(circle.position.x - position.x) > this.epsilon || Math.abs(circle.size.y - size.y) > this.epsilon ||
        Math.abs(circle.position.y - position.y) > this.epsilon || Math.abs(circle.size.y - size.y) > this.epsilon) {
        circle.set(position, size);
    }
};
CLOUD.Extensions.AnnotationEditor.prototype.startCross = function (x, y) {
    if (this.selectedAnnotation) return false;
    var start = this.getPointOnDomContainer(x, y);
    this.originX = start.x;
    this.originY = start.y;
    var minLen = this.annotationMinLen;
    var clientPosition = {x: start.x, y: start.y};
    var clientSize = {width: minLen, height: minLen};
    var position = this.getAnnotationWorldPosition(clientPosition);
    var size = this.getAnnotationWorldSize(clientSize, clientPosition);
    var id = this.generateAnnotationId();
    var cross = new CLOUD.Extensions.AnnotationCross(this, id);
    cross.set(position, size, 0);
    this.addAnnotation(cross);
    cross.created();
    this.selectedAnnotation = cross;
    return true;
};
CLOUD.Extensions.AnnotationEditor.prototype.moveCross = function (x, y) {
    if (!this.selectedAnnotation || !this.isCreating) {
        return;
    }
    var cross = this.selectedAnnotation;
    var end = this.getPointOnDomContainer(x, y);
    var bounds = this.getBounds();
    var startX = this.originX;
    var startY = this.originY;
    var endX = Math.min(Math.max(bounds.x, end.x), bounds.x + bounds.width);
    var endY = Math.min(Math.max(bounds.y, end.y), bounds.y + bounds.height);
    if (endX === startX && endY === startY) {
        endX++;
        endY++;
    }
    var clientPosition = {x: (startX + endX) / 2, y: (startY + endY) / 2};
    var clientSize = {width: Math.abs(endX - startX), height: Math.abs(endY - startY)};
    var position = this.getAnnotationWorldPosition(clientPosition);
    var size = this.getAnnotationWorldSize(clientSize, clientPosition);
    if (Math.abs(cross.position.x - position.x) > this.epsilon || Math.abs(cross.size.y - size.y) > this.epsilon ||
        Math.abs(cross.position.y - position.y) > this.epsilon || Math.abs(cross.size.y - size.y) > this.epsilon) {
        cross.set(position, size);
    }
};
CLOUD.Extensions.AnnotationEditor.prototype.startCloud = function (x, y) {
    if (this.selectedAnnotation) return false;
    var start = this.getPointOnDomContainer(x, y);
    this.originX = start.x;
    this.originY = start.y;
    var position = this.getAnnotationWorldPosition({x: start.x, y: start.y});
    this.cloudPoints = [position];
    var id = this.generateAnnotationId();
    var cloud = new CLOUD.Extensions.AnnotationCloud(this, id);
    cloud.setByPositions(this.cloudPoints);
    cloud.created();
    cloud.enableTrack();
    this.addAnnotation(cloud);
    this.selectedAnnotation = cloud;
    return true;
};
CLOUD.Extensions.AnnotationEditor.prototype.moveCloud = function (x, y) {
    if (!this.selectedAnnotation || !this.isCreating) {
        return;
    }
    var cloud = this.selectedAnnotation;
    if (cloud.getTrackState()) {
        var mouse = this.getPointOnDomContainer(x, y);
        var position = this.getAnnotationWorldPosition(mouse);
        cloud.startTrack();
        cloud.setTrackingPoint(position);
    }
};
CLOUD.Extensions.AnnotationEditor.prototype.endCloud = function (event, type) {
    if (event.button === this.mouseButtons.LEFT || (event.touches && event.touches.length === 0)) {
        if (!this.selectedAnnotation || !this.isCreating) {
            return;
        }
        var end = (type === "up") ? this.getPointOnDomContainer(event.clientX, event.clientY) : this.getPointOnDomContainer(event.touches[0].clientX, event.touches[0].clientY);
        var origin = {x: this.originX, y: this.originY};
        var threshold = 2; // 相差2个像素
        // 判断是否同一个点, 同一个点不加入集合
        if (CLOUD.Extensions.Utils.Geometric.isEqualBetweenPoints(origin, end, threshold)) return;
        var point = this.getAnnotationWorldPosition({x: end.x, y: end.y});
        this.cloudPoints.push(point);
        var cloud = this.selectedAnnotation;
        // 先禁止跟踪，在真正响应事件时启用
        cloud.disableTrack();
        var positions = this.cloudPoints;
        
        // 采用计时器来判断是否单击和双击
        function handleEnd() {
            cloud.finishTrack();
            cloud.setByPositions(positions);
            cloud.enableTrack();
        }
        
        if (this.isDblClickCloseCloud) {
            if (this.timerId) {
                clearTimeout(this.timerId);
            }
            // 延迟300ms以判断是否单击
            this.timerId = setTimeout(handleEnd, 300);
        } else {
            handleEnd();
        }
    } else if (event.button === this.mouseButtons.RIGHT) {
        this.mouseDoubleClickForCloud(event);
    }
};
CLOUD.Extensions.AnnotationEditor.prototype.mouseDoubleClickForCloud = function (event) {
    if (this.isCreating && this.selectedAnnotation) {
        if (this.selectedAnnotation.shapeType === CLOUD.Extensions.Annotation.shapeTypes.CLOUD) {
            if (this.isDblClickCloseCloud) {
                
                // 清除定时器
                if (this.timerId) {
                    clearTimeout(this.timerId);
                }
            }
            var position = this.getPointOnDomContainer(event.clientX, event.clientY);
            var point = this.getAnnotationWorldPosition(position);
            this.cloudPoints.push({x: point.x, y: point.y});
            this.selectedAnnotation.finishTrack();
            // 结束云图绘制，并封闭云图
            this.selectedAnnotation.setByPositions(this.cloudPoints, true);
            this.createAnnotationEnd();
            this.deselectAnnotation();
        }
    }
};
CLOUD.Extensions.AnnotationEditor.prototype.startText = function (x, y) {
    
    //if (this.forceAnnotationTextComplete() ) {
    //    return;
    //}
    if (this.selectedAnnotation) {
        return;
    }
    var start = this.getPointOnDomContainer(x, y);
    var clientFontSize = 16;
    var originWidth = clientFontSize * 20;
    var originHeight = clientFontSize * 4;
    var clientPosition = {x: start.x + 0.5 * originWidth, y: start.y + 0.5 * originHeight};
    var clientSize = {width: originWidth, height: originHeight};
    var position = this.getAnnotationWorldPosition(clientPosition);
    var size = this.getAnnotationWorldSize(clientSize, clientPosition);
    var id = this.generateAnnotationId();
    //var text = new CLOUD.Extensions.AnnotationText(this, id);
    var text = this.currentAnnotationText = new CLOUD.Extensions.AnnotationText(this, id);
    text.set(position, size, 0, '');
    this.addAnnotation(text);
    text.created();
    text.forceRedraw();
    this.selectedAnnotation = text;
    var textArea = this.getTextArea();
    textArea.active(this.selectedAnnotation, true);
    return true;
};
CLOUD.Extensions.AnnotationEditor.prototype.mouseDoubleClickForText = function (event, annotation) {
    if (annotation) {
        if (this.selectedAnnotation && (this.selectedAnnotation.shapeType === CLOUD.Extensions.Annotation.shapeTypes.TEXT)) {
            this.currentAnnotationText = annotation;
            this.selectedAnnotation.hide();
            this.deselectAnnotation();
            var textArea = this.getTextArea();
            textArea.active(annotation, true);
        }
    }
};
CLOUD.Extensions.AnnotationEditor.prototype.init = function (callbacks) {
    if (callbacks) {
        this.beginEditCallback = callbacks.beginEditCallback;
        this.endEditCallback = callbacks.endEditCallback;
        this.changeEditorModeCallback = callbacks.changeEditorModeCallback;
    }
    if (!this.svg) {
        var rect = this.getDomContainerBounds();
        this.bounds.width = rect.width;
        this.bounds.height = rect.height;
        this.svg = CLOUD.Extensions.Utils.Shape2D.createSvgElement('svg');
        this.svg.style.position = "absolute";
        this.svg.style.display = "block";
        this.svg.style.left = "0";
        this.svg.style.top = "0";
        this.svg.setAttribute('width', rect.width + '');
        this.svg.setAttribute('height', rect.height + '');
        this.domElement.appendChild(this.svg);
        this.enableSVGPaint(false);
        this.annotationFrame = new CLOUD.Extensions.AnnotationFrame(this, this.domElement);
        if (this.popupCallback) {
            this.annotationPopupTextArea = new CLOUD.Extensions.AnnotationPopupTextArea(this, this.domElement, this.popupCallback);
        } else {
            this.annotationTextArea = new CLOUD.Extensions.AnnotationTextArea(this, this.domElement);
        }
    }
    this.initialized = true;
};
CLOUD.Extensions.AnnotationEditor.prototype.uninit = function () {
    this.initialized = false;
    if (!this.svg) return;
    // 如果仍然处在编辑中，强行结束
    if (this.isEditing) {
        this.editEnd();
    }
    // 卸载数据
    this.unloadAnnotations();
    if (this.svg.parentNode) {
        this.svg.parentNode.removeChild(this.svg);
    }
    this.svgGroup = null;
    this.svg = null;
    this.beginEditCallback = null;
    this.endEditCallback = null;
    this.changeEditorModeCallback = null;
    //this.destroy();
};
CLOUD.Extensions.AnnotationEditor.prototype.isInitialized = function () {
    return this.initialized;
};
CLOUD.Extensions.AnnotationEditor.prototype.destroy = function () {
    this.forceAnnotationTextComplete();
    this.deselectAnnotation();
    if (this.annotationFrame) {
        this.annotationFrame.destroy();
        this.annotationFrame = null;
    }
    if (this.currentAnnotationText) {
        this.currentAnnotationText = null;
    }
    if (this.popupCallback) {
        this.popupCallback = null;
    }
};
CLOUD.Extensions.AnnotationEditor.prototype.generateAnnotationId = function () {
    ++this.nextAnnotationId;
    return this.nextAnnotationId.toString(10);
    //return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    //    return v.toString(16);
    //});
};
CLOUD.Extensions.AnnotationEditor.prototype.onExistEditor = function () {
    this.uninit();
};
CLOUD.Extensions.AnnotationEditor.prototype.editBegin = function () {
    if (this.isEditing) {
        return true;
    }
    if (!this.svgGroup) {
        this.svgGroup = CLOUD.Extensions.Utils.Shape2D.createSvgElement('g');
    }
    if (!this.svgGroup.parentNode) {
        this.svg.insertBefore(this.svgGroup, this.svg.firstChild);
    }
    this.handleCallbacks("beginEdit");
    // 注册事件
    this.addDomEventListeners();
    // 允许在SVG上绘图
    this.enableSVGPaint(true);
    // 清除数据
    this.clear();
    this.isEditing = true;
};
CLOUD.Extensions.AnnotationEditor.prototype.editEnd = function () {
    this.isEditing = false;
    this.forceAnnotationTextComplete();
    if (this.svgGroup && this.svgGroup.parentNode) {
        //this.svg.removeChild(this.svgGroup);
        this.svgGroup.parentNode.removeChild(this.svgGroup);
    }
    this.removeDomEventListeners();
    this.handleCallbacks("endEdit");
    // 不允许穿透
    this.enableSVGPaint(false);
    this.deselectAnnotation();
};
CLOUD.Extensions.AnnotationEditor.prototype.createAnnotationBegin = function () {
    if (!this.isCreating) {
        this.isCreating = true;
        this.disableAnnotationInteractions(true);
    }
};
CLOUD.Extensions.AnnotationEditor.prototype.createAnnotationEnd = function () {
    if (this.isCreating) {
        this.isCreating = false;
        this.disableAnnotationInteractions(false);
    }
};
CLOUD.Extensions.AnnotationEditor.prototype.dragAnnotationFrameBegin = function () {
    this.disableAnnotationInteractions(true)
};
CLOUD.Extensions.AnnotationEditor.prototype.dragAnnotationFrameEnd = function () {
    this.disableAnnotationInteractions(false)
};
CLOUD.Extensions.AnnotationEditor.prototype.clear = function () {
    var annotations = this.annotations;
    while (annotations.length) {
        var annotation = annotations[0];
        this.removeAnnotation(annotation);
        annotation.destroy();
    }
    var group = this.svgGroup;
    if (group && group.childNodes.length > 0) {
        while (group.childNodes.length) {
            group.removeChild(group.childNodes[0]);
        }
    }
};
CLOUD.Extensions.AnnotationEditor.prototype.setAnnotationType = function (type) {
    this.forceAnnotationTextComplete();
    this.annotationType = type;
    // 强行完成
    this.createAnnotationEnd();
    this.deselectAnnotation();
    this.onFocus();
};
CLOUD.Extensions.AnnotationEditor.prototype.addAnnotation = function (annotation) {
    annotation.setParent(this.svgGroup);
    this.annotations.push(annotation);
};
CLOUD.Extensions.AnnotationEditor.prototype.deleteAnnotation = function (annotation) {
    if (annotation) {
        this.removeAnnotation(annotation);
        annotation.destroy();
    }
};
CLOUD.Extensions.AnnotationEditor.prototype.removeAnnotation = function (annotation) {
    var idx = this.annotations.indexOf(annotation);
    if (idx !== -1) {
        this.annotations.splice(idx, 1);
    }
};
CLOUD.Extensions.AnnotationEditor.prototype.setAnnotationSelection = function (annotation) {
    if (this.selectedAnnotation !== annotation) {
        this.deselectAnnotation();
    }
    this.selectedAnnotation = annotation;
    // 放在最前面
    if (!this.isCreating) {
        this.annotationFrame.setAnnotation(annotation);
    }
};
CLOUD.Extensions.AnnotationEditor.prototype.selectAnnotation = function (annotation) {
    if (annotation) {
        var shapeType = annotation.shapeType;
        if (this.annotationType === shapeType) {
            this.setAnnotationSelection(annotation)
        } else {
            this.setAnnotationSelection(null);
            //this.setAnnotationType(shapeType);
            this.setAnnotationSelection(annotation);
        }
        if (shapeType === CLOUD.Extensions.Annotation.shapeTypes.TEXT) {
            this.currentAnnotationText = annotation;
        } else {
            this.currentAnnotationText = null;
        }
    } else {
        this.setAnnotationSelection(null);
        this.currentAnnotationText = null;
    }
};
CLOUD.Extensions.AnnotationEditor.prototype.deselectAnnotation = function () {
    if (this.selectedAnnotation) {
        this.selectedAnnotation.deselect();
        this.selectedAnnotation = null;
    }
    this.annotationFrame.setAnnotation(null);
};
CLOUD.Extensions.AnnotationEditor.prototype.worldToClient = function (wPoint) {
    
    // var rect = this.getDomContainerBounds();
    var result = new THREE.Vector3(wPoint.x, wPoint.y, wPoint.z);
    // // 变换到相机空间
    // result.applyMatrix4(camera.matrixWorld);
    // result.sub(camera.position);
    // result.project(camera);
    //
    // // 变换到屏幕空间
    // result.x = Math.floor(0.5 * (result.x + 1) * rect.width + 0.5);
    // result.y = Math.floor(-0.5 * (result.y - 1) * rect.height + 0.5);
    // result.z = 0;
    return result;
};
CLOUD.Extensions.AnnotationEditor.prototype.clientToWorld = function (cPoint) {
    
    // var rect = this.getDomContainerBounds();
    var result = new THREE.Vector3(cPoint.x, cPoint.y, 0);
    //
    // result.x = cPoint.x / rect.width * 2 - 1;
    // result.y = -cPoint.y / rect.height * 2 + 1;
    // result.z = 0;
    //
    // result.unproject(camera);
    // result.add(camera.position).applyMatrix4(camera.matrixWorldInverse);
    // //result.z = 0;
    return result;
};
CLOUD.Extensions.AnnotationEditor.prototype.getAnnotationWorldPosition = function (cPos) {
    return this.clientToWorld(cPos);
};
CLOUD.Extensions.AnnotationEditor.prototype.getAnnotationClientPosition = function (wPos) {
    return this.worldToClient(wPos);
};
CLOUD.Extensions.AnnotationEditor.prototype.getAnnotationWorldSize = function (cSize, cPos) {
    var lt = this.clientToWorld({x: cPos.x - 0.5 * cSize.width, y: cPos.y - 0.5 * cSize.height});
    var rb = this.clientToWorld({x: cPos.x + 0.5 * cSize.width, y: cPos.y + 0.5 * cSize.height});
    return {width: Math.abs(rb.x - lt.x), height: Math.abs(rb.y - lt.y)}
};
CLOUD.Extensions.AnnotationEditor.prototype.getAnnotationClientSize = function (wSize, wPos) {
    var lt = this.worldToClient({x: wPos.x - 0.5 * wSize.width, y: wPos.y - 0.5 * wSize.height, z: wPos.z});
    var rb = this.worldToClient({x: wPos.x + 0.5 * wSize.width, y: wPos.y + 0.5 * wSize.height, z: wPos.z});
    return {width: Math.abs(rb.x - lt.x), height: Math.abs(rb.y - lt.y)};
};
CLOUD.Extensions.AnnotationEditor.prototype.getBounds = function () {
    return this.bounds;
};
CLOUD.Extensions.AnnotationEditor.prototype.getPointOnDomContainer = function (clientX, clientY) {
    var rect = this.getDomContainerBounds();
    return new THREE.Vector2(clientX - rect.left, clientY - rect.top);
};
CLOUD.Extensions.AnnotationEditor.prototype.getDomContainerBounds = function () {
    return CLOUD.DomUtil.getContainerOffsetToClient(this.domElement);
};
CLOUD.Extensions.AnnotationEditor.prototype.getViewBox = function (clientWidth, clientHeight) {
    var lt = this.clientToWorld({x: 0, y: 0});
    var rb = this.clientToWorld({x: clientWidth, y: clientHeight});
    var left = Math.min(lt.x, rb.x);
    var top = Math.min(lt.y, rb.y);
    var right = Math.max(lt.x, rb.x);
    var bottom = Math.max(lt.y, rb.y);
    return [left, top, right - left, bottom - top].join(' ');
};
CLOUD.Extensions.AnnotationEditor.prototype.handleTextChange = function (data) {
    var textAnnotation = data.annotation;
    if (data.text === '') {
        this.selectAnnotation(null);
        data.annotation.delete();
        return;
    }
    var clientPosition = {x: data.position.x, y: data.position.y};
    var clientSize = {width: data.width, height: data.height};
    var position = this.getAnnotationWorldPosition(clientPosition);
    var size = this.getAnnotationWorldSize(clientSize, clientPosition);
    textAnnotation.resetSize(size, position);
    textAnnotation.setText(data.text);
    this.createAnnotationEnd();
    this.deselectAnnotation();
};
CLOUD.Extensions.AnnotationEditor.prototype.disableAnnotationInteractions = function (disable) {
    this.annotations.forEach(function (annotation) {
        annotation.disableInteractions(disable);
    });
};
CLOUD.Extensions.AnnotationEditor.prototype.handleCallbacks = function (name) {
    switch (name) {
        case "beginEdit":
            if (this.beginEditCallback) {
                this.beginEditCallback(this.domElement);
            }
            break;
        case "endEdit":
            if (this.endEditCallback) {
                this.endEditCallback(this.domElement);
            }
            break;
        case "changeEditor":
            if (this.changeEditorModeCallback) {
                this.changeEditorModeCallback(this.domElement);
            }
            break;
    }
};
CLOUD.Extensions.AnnotationEditor.prototype.renderToCanvas = function (ctx) {
    this.annotations.forEach(function (annotation) {
        ctx.save();
        annotation.renderToCanvas(ctx);
        ctx.restore();
    });
};
// 是否允许在SVG上绘图
CLOUD.Extensions.AnnotationEditor.prototype.enableSVGPaint = function (enable) {
    if (enable) {
        this.svg && this.svg.setAttribute("pointer-events", "painted");
    } else {
        this.svg && this.svg.setAttribute("pointer-events", "none");
    }
};
// 强制结束文本批注的编辑
CLOUD.Extensions.AnnotationEditor.prototype.forceAnnotationTextComplete = function () {
    
    //if (this.annotationType === CLOUD.Extensions.Annotation.shapeTypes.TEXT) {
    if (this.annotationTextArea && this.annotationTextArea.isActive()) {
        this.annotationTextArea.accept();
        if (this.currentAnnotationText) {
            this.currentAnnotationText = null;
        }
        return true;
    }
    //}
    return false;
};
// 强制结束文本批注的编辑
CLOUD.Extensions.AnnotationEditor.prototype.resetCurrentAnnotationText = function () {
    if (this.currentAnnotationText) {
        this.currentAnnotationText = null;
    }
};
// ---------------------------- 外部 API BEGIN ---------------------------- //
// 屏幕快照
CLOUD.Extensions.AnnotationEditor.prototype.getScreenSnapshot = function (snapshot, callback) {
    var canvas = document.createElement("canvas");
    var bounds = this.getDomContainerBounds();
    canvas.width = bounds.width;
    canvas.height = bounds.height;
    var ctx = canvas.getContext('2d');
    var startColor = this.gradientStartColor;
    var stopColor = this.gradientStopColor;
    var scope = this;
    // 绘制背景
    if (startColor) {
        if (stopColor) {
            var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, startColor);
            gradient.addColorStop(1, stopColor);
            ctx.fillStyle = gradient;
        } else {
            ctx.fillStyle = startColor;
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    // fixed bug: 在chrome 版本 57.0.2987.133 (64-bit)上截不到图，估计是图片异步加载的问题, 采用回调函数处理。
    if (callback && snapshot) {
        var preSnapshot = new Image();
        preSnapshot.onload = function () {
            ctx.drawImage(preSnapshot, 0, 0);
            setTimeout(function () {
                scope.renderToCanvas(ctx);// 绘制批注
                var data = canvas.toDataURL("image/png");
                canvas = ctx = null;
                callback(data);
            }, 1000)
        };
        preSnapshot.src = snapshot;
        return null;
    }
    // 先绘制之前的图像
    if (snapshot) {
        var preSnapshot = new Image();
        preSnapshot.src = snapshot;
        ctx.drawImage(preSnapshot, 0, 0);
    }
    this.renderToCanvas(ctx);// 绘制批注
    var data = canvas.toDataURL("image/png");
    canvas = ctx = null;
    return data;
};
// 设置导出背景色
CLOUD.Extensions.AnnotationEditor.prototype.setBackgroundColor = function (startColor, stopColor) {
    this.gradientStartColor = startColor;
    this.gradientStopColor = stopColor;
};
// 获得批注列表
CLOUD.Extensions.AnnotationEditor.prototype.getAnnotationInfoList = function () {
    
    // 强行完成
    this.forceAnnotationTextComplete();
    this.createAnnotationEnd();
    this.deselectAnnotation();
    var annotationInfoList = [];
    for (var i = 0, len = this.annotations.length; i < len; i++) {
        var annotation = this.annotations[i];
        var text = "";
        if (annotation.shapeType === CLOUD.Extensions.Annotation.shapeTypes.TEXT) {
            text = encodeURIComponent(annotation.currText); // 编码中文
            //text = annotation.currText; // 编码中文
        }
        var shapePoints = "";
        var originSize = null;
        if (annotation.shapeType === CLOUD.Extensions.Annotation.shapeTypes.CLOUD) {
            shapePoints = annotation.getShapePoints();
            originSize = annotation.originSize;
        }
        var info = {
            id: annotation.id,
            shapeType: annotation.shapeType,
            position: annotation.position,
            size: annotation.size,
            rotation: annotation.rotation,
            shapePoints: shapePoints,
            originSize: originSize,
            style: annotation.style, //
            text: text
        };
        annotationInfoList.push(info);
    }
    return annotationInfoList;
};
// 加载批注
CLOUD.Extensions.AnnotationEditor.prototype.loadAnnotations = function (annotationInfoList) {
    if (!this.svgGroup) {
        this.svgGroup = CLOUD.Extensions.Utils.Shape2D.createSvgElement('g');
    }
    // 清除数据
    this.clear();
    if (!this.svgGroup.parentNode) {
        this.svg.insertBefore(this.svgGroup, this.svg.firstChild);
    }
    for (var i = 0, len = annotationInfoList.length; i < len; i++) {
        var info = annotationInfoList[i];
        var id = info.id;
        var shapeType = info.shapeType;
        var position = info.position;
        var size = info.size;
        var rotation = info.rotation;
        var shapePointsStr = info.shapePoints;
        var originSize = info.originSize;
        //var text = info.text; // 解码中文
        var text = decodeURIComponent(info.text); // 解码中文
        var style = info.style ? info.style : this.annotationStyle;
        switch (shapeType) {
            case CLOUD.Extensions.Annotation.shapeTypes.ARROW:
                var arrow = new CLOUD.Extensions.AnnotationArrow(this, id);
                arrow.set(position, size, rotation);
                arrow.setStyle(style);
                this.addAnnotation(arrow);
                arrow.created();
                break;
            case  CLOUD.Extensions.Annotation.shapeTypes.RECTANGLE:
                var rectangle = new CLOUD.Extensions.AnnotationRectangle(this, id);
                rectangle.set(position, size, rotation);
                rectangle.setStyle(style);
                this.addAnnotation(rectangle);
                rectangle.created();
                break;
            case  CLOUD.Extensions.Annotation.shapeTypes.CIRCLE:
                var circle = new CLOUD.Extensions.AnnotationCircle(this, id);
                circle.set(position, size, rotation);
                circle.setStyle(style);
                this.addAnnotation(circle);
                circle.created();
                break;
            case  CLOUD.Extensions.Annotation.shapeTypes.CROSS:
                var cross = new CLOUD.Extensions.AnnotationCross(this, id);
                cross.set(position, size, rotation);
                cross.setStyle(style);
                this.addAnnotation(cross);
                cross.created();
                break;
            case CLOUD.Extensions.Annotation.shapeTypes.CLOUD:
                var cloud = new CLOUD.Extensions.AnnotationCloud(this, id);
                cloud.set(position, size, rotation, shapePointsStr, originSize);
                cloud.setStyle(style);
                this.addAnnotation(cloud);
                cloud.created();
                break;
            case  CLOUD.Extensions.Annotation.shapeTypes.TEXT:
                var textAnnotation = new CLOUD.Extensions.AnnotationText(this, id);
                textAnnotation.set(position, size, rotation, text);
                textAnnotation.setStyle(style);
                this.addAnnotation(textAnnotation);
                textAnnotation.created();
                textAnnotation.forceRedraw();
                break;
            default :
                break;
        }
    }
};
// 卸载批注
CLOUD.Extensions.AnnotationEditor.prototype.unloadAnnotations = function () {
    
    // 清除数据
    this.clear();
    if (this.svgGroup && this.svgGroup.parentNode) {
        this.svgGroup.parentNode.removeChild(this.svgGroup);
    }
};
// 显示批注
CLOUD.Extensions.AnnotationEditor.prototype.showAnnotations = function () {
    if (this.svgGroup) {
        this.svgGroup.setAttribute("visibility", "visible");
    }
};
// 隐藏批注
CLOUD.Extensions.AnnotationEditor.prototype.hideAnnotations = function () {
    if (this.svgGroup) {
        this.svgGroup.setAttribute("visibility", "hidden");
    }
};
// 设置批注风格（边框色，填充色，字体大小等等）
CLOUD.Extensions.AnnotationEditor.prototype.setAnnotationStyle = function (style, updateText) {
    this.annotationStyle = CLOUD.DomUtil.cloneStyle(style);
    if (updateText) {
        
        //if (this.annotationType === CLOUD.Extensions.Annotation.shapeTypes.TEXT) {
        // 对文本特殊处理
        if (this.currentAnnotationText) {
            this.currentAnnotationText.updateStyle(style);
            if (this.annotationTextArea) {
                this.annotationTextArea.setStyle(style);
            }
        }
        // }
    }
};
// 更新所有批注
CLOUD.Extensions.AnnotationEditor.prototype.updateAnnotations = function () {
    for (var i = 0, len = this.annotations.length; i < len; i++) {
        var annotation = this.annotations[i];
        annotation.update();
    }
    if (this.annotationFrame && this.selectedAnnotation) {
        this.annotationFrame.setAnnotation(this.selectedAnnotation)
    }
};
CLOUD.Extensions.AnnotationEditor.prototype.onCameraChange = function () {
};
CLOUD.Extensions.AnnotationEditor.prototype.enableDblClickCloseCloud = function (enable) {
    this.isDblClickCloseCloud = enable;
};
CLOUD.Extensions.AnnotationEditor.prototype.getTextArea = function () {
    var textArea;
    if (this.popupCallback) {
        textArea = this.annotationPopupTextArea;
    } else {
        textArea = this.annotationTextArea;
    }
    return textArea;
};
CLOUD.Extensions.AnnotationEditor.prototype.setTextFromPopupBox = function (text) {
    if (this.popupCallback) {
        this.annotationPopupTextArea.accept(text);
    }
};
CLOUD.Extensions.AnnotationEditor.prototype.unsetTextFromPopupBox = function () {
    if (this.popupCallback) {
        this.annotationPopupTextArea.unaccept();
    }
};
// ---------------------------- 外部 API END ---------------------------- //
var CLOUD = CLOUD || {};
CLOUD.Extensions = CLOUD.Extensions || {};
CLOUD.Extensions.AnnotationEditor2D = function (domElement, options) {
    "use strict";
    CLOUD.Extensions.AnnotationEditor.call(this, domElement, options);
    this.absoluteBasePoint = null;
    this.screenBasePoint = null;
    this.zoomFactor = {x: 1.0, y: 1.0};
};
CLOUD.Extensions.AnnotationEditor2D.prototype = Object.create(CLOUD.Extensions.AnnotationEditor.prototype);
CLOUD.Extensions.AnnotationEditor2D.prototype.constructor = CLOUD.Extensions.AnnotationEditor2D;
CLOUD.Extensions.AnnotationEditor2D.prototype.setDomContainer = function (domElement) {
    if (domElement) {
        this.domElement = domElement;
    }
};
// 设置绝对基点
CLOUD.Extensions.AnnotationEditor2D.prototype.setAbsoluteBasePoint = function (point) {
    if (point) {
        if (!this.absoluteBasePoint) {
            this.absoluteBasePoint = {};
        }
        this.absoluteBasePoint.x = point.x;
        this.absoluteBasePoint.y = point.y;
    }
};
// 设置屏幕基点
CLOUD.Extensions.AnnotationEditor2D.prototype.setScreenBasePoint = function (point) {
    if (point) {
        if (!this.screenBasePoint) {
            this.screenBasePoint = {};
        }
        this.screenBasePoint.x = point.x;
        this.screenBasePoint.y = point.y;
    }
};
// 设置缩放因子
CLOUD.Extensions.AnnotationEditor2D.prototype.setZoomFactor = function (factorX, factorY) {
    factorX = factorX || 1.0;
    factorY = factorY || 1.0;
    this.zoomFactor.x = factorX;
    this.zoomFactor.y = factorY;
};
CLOUD.Extensions.AnnotationEditor2D.prototype.worldToClient = function (wPoint) {
    
    // (Wp - Wc) * zoomFactor = Sp - Sc ===> Sp = (Wp - Wc) * zoomFactor + Sc
    var rect = this.getDomContainerBounds();
    var result = new THREE.Vector3();
    var absBasePoint = this.absoluteBasePoint;
    var screenBasePoint = this.screenBasePoint;
    if (!this.absoluteBasePoint) {
        absBasePoint = {x: 0.0, y: 0.0};
    }
    if (!this.screenBasePoint) {
        this.screenBasePoint = {x: rect.width * 0.5, y: rect.height * 0.5};
    }
    // 变换到屏幕空间
    result.x = (wPoint.x - absBasePoint.x) * this.zoomFactor.x + this.screenBasePoint.x;
    result.y = (-wPoint.y/**2*/ - absBasePoint.y) * this.zoomFactor.y + this.screenBasePoint.y;
    result.z = 0;
    return result;
};
CLOUD.Extensions.AnnotationEditor2D.prototype.clientToWorld = function (cPoint) {
    
    // Wp - Wc = Sp - Sc ===> Wp = Sp - Sc + Wc
    // (Wp - Wc) * zoomFactor = Sp - Sc ===> Wp = (Sp - Sc) / zoomFactor + Wc
    var rect = this.getDomContainerBounds();
    var result = new THREE.Vector3();
    var invFactorX = 1 / this.zoomFactor.x;
    var invFactorY = 1 / this.zoomFactor.y;
    var absBasePoint = this.absoluteBasePoint;
    var screenBasePoint = this.screenBasePoint;
    if (!this.absoluteBasePoint) {
        absBasePoint = {x: 0.0, y: 0.0};
    }
    if (!this.screenBasePoint) {
        screenBasePoint = {x: rect.width * 0.5, y: rect.height * 0.5};
    }
    result.x = (cPoint.x - screenBasePoint.x) * invFactorX + absBasePoint.x;
    result.y = -((cPoint.y - screenBasePoint.y) * invFactorY + absBasePoint.y); // 翻转,因为绘制图形参照坐标和屏幕的坐标系不同
    result.z = 0;
    return result;
};
CLOUD.Extensions.AnnotationEditor2D.prototype.onCameraChange = function () {
    this.handleCallbacks("changeEditor");
};
CLOUD.Extensions.AnnotationEditor2D.prototype.setSvgZIndex = function (zIndex) {
    zIndex = zIndex || 18;
    if (this.svg) {
        this.svg.style.zIndex = zIndex;
    }
};
var CLOUD = CLOUD || {};
CLOUD.Extensions = CLOUD.Extensions || {};
CLOUD.Extensions.AnnotationEditor3D = function (domElement, camera, options) {
    "use strict";
    CLOUD.Extensions.AnnotationEditor.call(this, domElement, options);
    this.camera = camera;
};
CLOUD.Extensions.AnnotationEditor3D.prototype = Object.create(CLOUD.Extensions.AnnotationEditor.prototype);
CLOUD.Extensions.AnnotationEditor3D.prototype.constructor = CLOUD.Extensions.AnnotationEditor3D;
CLOUD.Extensions.AnnotationEditor3D.prototype.setDomContainer = function (domElement) {
    if (domElement) {
        this.domElement = domElement;
    }
};
CLOUD.Extensions.AnnotationEditor3D.prototype.worldToClient = function (wPoint) {
    var bounds = this.getDomContainerBounds();
    var camera = this.camera;
    var result = new THREE.Vector3(wPoint.x, wPoint.y, wPoint.z);
    // 变换到相机空间
    result.applyMatrix4(camera.matrixWorld);
    result.sub(camera.position);
    result.project(camera);
    // 变换到屏幕空间
    result.x = Math.floor(0.5 * (result.x + 1) * bounds.width + 0.5);
    result.y = Math.floor(-0.5 * (result.y - 1) * bounds.height + 0.5);
    result.z = 0;
    return result;
};
CLOUD.Extensions.AnnotationEditor3D.prototype.clientToWorld = function (cPoint) {
    var bounds = this.getDomContainerBounds();
    var camera = this.camera;
    var result = new THREE.Vector3();
    result.x = cPoint.x / bounds.width * 2 - 1;
    result.y = -cPoint.y / bounds.height * 2 + 1;
    result.z = 0;
    result.unproject(camera);
    result.add(camera.position).applyMatrix4(camera.matrixWorldInverse);
    //result.z = 0;
    return result;
};
CLOUD.Extensions.AnnotationEditor3D.prototype.onCameraChange = function () {
    if (this.camera.dirty) {
        this.handleCallbacks("changeEditor");
    }
};
CLOUD.Extensions.Marker = function (id, editor) {
    this.id = id;
    this.editor = editor;
    this.position = new THREE.Vector3();
    this.boundingBox = new THREE.Box3();
    this.shape = null;
    this.style = CLOUD.Extensions.Marker.getDefaultStyle();
    this.selected = false;
    this.highlighted = false;
    this.highlightColor = '#000088';
    this.isDisableInteractions = false;
    this.keys = {
        BACKSPACE: 8,
        ALT: 18,
        ESC: 27,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        BOTTOM: 40,
        DELETE: 46,
        ZERO: 48,
        A: 65,
        D: 68,
        E: 69,
        Q: 81,
        S: 83,
        W: 87,
        PLUS: 187,
        SUB: 189
    };
    this.onMouseDownBinded = this.onMouseDown.bind(this);
    this.onKeyUpBinded = this.onKeyUp.bind(this);
};
CLOUD.Extensions.Marker.prototype = {
    constructor: CLOUD.Extensions.Marker,
    addDomEventListeners: function () {
        this.shape.addEventListener("mousedown", this.onMouseDownBinded, true);
        window.addEventListener("keyup", this.onKeyUpBinded);
    },
    removeDomEventListeners: function () {
        this.shape.removeEventListener("mousedown", this.onMouseDownBinded, true);
        window.removeEventListener("keyup", this.onKeyUpBinded);
    },
    onMouseDown: function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.select();
    },
    onKeyUp: function (event) {
        switch (event.keyCode) {
            case this.keys.DELETE:
                this.editor.deselectMarker();
                this.delete();
                break;
            default :
                break;
        }
    },
    createShape: function () {
    },
    destroy: function () {
        this.removeDomEventListeners();
        this.deselect();
        this.setParent(null);
    },
    set: function (userId, position, boundingBox, style) {
        this.userId = userId;
        this.position.set(position.x, position.y, position.z);
        this.boundingBox = boundingBox.clone();
        if (style) {
            this.style = CLOUD.DomUtil.cloneStyle(style);
        }
        this.update();
    },
    setParent: function (parent) {
        var shapeEl = this.shape;
        if (shapeEl) {
            if (shapeEl.parentNode) {
                shapeEl.parentNode.removeChild(shapeEl);
            }
            if (parent) {
                parent.appendChild(shapeEl);
            }
        }
    },
    setStyle: function (style) {
        this.style = CLOUD.DomUtil.cloneStyle(style);
        this.update();
    },
    select: function () {
        
        //if (this.selected) {
        //    return;
        //}
        //
        //this.selected = true;
        //this.highlighted = false;
        //this.update();
        //this.editor.selectMarker(this);
        if (!this.selected) {
            this.selected = true;
            this.highlight(true);
        }
        this.editor.selectMarker(this);
    },
    deselect: function () {
        this.highlight(false);
        this.selected = false;
    },
    highlight: function (isHighlight) {
        if (this.isDisableInteractions) {
            return;
        }
        this.highlighted = isHighlight;
        this.update();
    },
    disableInteractions: function (disable) {
        this.isDisableInteractions = disable;
    },
    delete: function () {
        this.editor.deleteMarker(this);
    },
    getClientPosition: function () {
        return this.editor.worldToClient(this.position);
    },
    getBoundingBox: function () {
        return this.boundingBox;
    },
    toNewObject: function () {
        return {
            id: this.id,
            userId: this.userId,
            shapeType: this.shapeType,
            position: this.position ? this.position.clone() : null,
            boundingBox: this.boundingBox ? this.boundingBox.clone() : null
        };
    },
    update: function () {
        var strokeWidth = this.style['stroke-width'];
        var strokeColor = this.highlighted ? this.highlightColor : this.style['stroke-color'];
        var strokeOpacity = this.style['stroke-opacity'];
        var fillColor = this.style['fill-color'];
        var fillOpacity = this.style['fill-opacity'];
        var position = this.getClientPosition();
        if (!position) {
            this.shape.style.display = "none";
            return;
        }
        if (this.shape.style.display !== '') {
            this.shape.style.display = '';
        }
        var offsetX = position.x;
        var offsetY = position.y;
        var transformShape = [
            'translate(', offsetX, ',', offsetY, ') '
        ].join('');
        this.shape.setAttribute("transform", transformShape);
        this.shape.setAttribute("stroke-width", strokeWidth);
        this.shape.setAttribute("stroke", strokeColor);
        this.shape.setAttribute("stroke-opacity", strokeOpacity);
        this.shape.setAttribute('fill', fillColor);
        this.shape.setAttribute('fill-opacity', fillOpacity);
    }
};
CLOUD.Extensions.Marker.shapeTypes = {BUBBLE: 0, FLAG: 1, COMMON: 2};
CLOUD.Extensions.Marker.getDefaultStyle = function () {
    var style = {};
    style['stroke-width'] = 2;
    style['stroke-color'] = '#fffaff';
    style['stroke-opacity'] = 1.0;
    style['fill-color'] = '#ff2129';
    style['fill-opacity'] = 1.0;
    return style;
};
CLOUD.Extensions.MarkerBubble = function (id, editor) {
    CLOUD.Extensions.Marker.call(this, id, editor);
    this.shapeType = CLOUD.Extensions.Marker.shapeTypes.BUBBLE;
    this.createShape();
    this.addDomEventListeners();
};
CLOUD.Extensions.MarkerBubble.prototype = Object.create(CLOUD.Extensions.Marker.prototype);
CLOUD.Extensions.MarkerBubble.prototype.constructor = CLOUD.Extensions.Marker;
CLOUD.Extensions.MarkerBubble.prototype.createShape = function () {
    this.shape = CLOUD.Extensions.Utils.Shape2D.makeBubble();
};
CLOUD.Extensions.MarkerFlag = function (id, editor) {
    CLOUD.Extensions.Marker.call(this, id, editor);
    this.shapeType = CLOUD.Extensions.Marker.shapeTypes.FLAG;
    this.createShape();
    this.addDomEventListeners();
};
CLOUD.Extensions.MarkerFlag.prototype = Object.create(CLOUD.Extensions.Marker.prototype);
CLOUD.Extensions.MarkerFlag.prototype.constructor = CLOUD.Extensions.Marker;
CLOUD.Extensions.MarkerFlag.prototype.createShape = function () {
    this.shape = CLOUD.Extensions.Utils.Shape2D.makeFlag();
};
CLOUD.Extensions.MarkerCommon = function (id, editor, url) {
    CLOUD.Extensions.Marker.call(this, id, editor);
    this.shapeType = CLOUD.Extensions.Marker.shapeTypes.COMMON;
    this.createShape(url);
    this.addDomEventListeners();
};
CLOUD.Extensions.MarkerCommon.prototype = Object.create(CLOUD.Extensions.Marker.prototype);
CLOUD.Extensions.MarkerCommon.prototype.constructor = CLOUD.Extensions.Marker;
CLOUD.Extensions.MarkerCommon.prototype.createShape = function (url) {
    this.shape = CLOUD.Extensions.Utils.Shape2D.makeCommon(url);
};
CLOUD.Extensions.MarkerEditor = function (viewer) {
    "use strict";
    this.cameraEditor = viewer.cameraControl;
    this.scene = viewer.getScene();
    this.domElement = viewer.domElement;
    this.markers = [];
    this.selectedMarker = null;
    // 隐患待整改：红色
    // 隐患已整改：黄色
    // 隐患已关闭：绿色
    // size: 15 * 20
    this.flagColors = {red: "#ff2129", green: "#85af03", yellow: "#fe9829"};
    // 有隐患：红色
    // 无隐患：绿色
    // 过程验收点、开业验收点的未检出：灰色 --> 橙色
    // size: 14 * 20
    this.bubbleColors = {red: "#f92a24", green: "#86b507", gray: "#ff9326"};
    this.nextMarkerId = 0;
    this.initialized = false;
    this.markerClickCallback = null;
};
CLOUD.Extensions.MarkerEditor.prototype.onResize = function () {
    if (!this.svg) return;
    var bounds = this.getDomContainerBounds();
    this.svg.setAttribute('width', bounds.width + '');
    this.svg.setAttribute('height', bounds.height + '');
    this.updateMarkers();
};
CLOUD.Extensions.MarkerEditor.prototype.init = function () {
    if (!this.svg) {
        var bounds = this.getDomContainerBounds();
        var svgWidth = bounds.width;
        var svgHeight = bounds.height;
        this.svg = CLOUD.Extensions.Utils.Shape2D.createSvgElement('svg');
        this.svg.style.position = "absolute";
        this.svg.style.display = "block";
        this.svg.style.position = "absolute";
        this.svg.style.display = "block";
        this.svg.style.left = "0";
        this.svg.style.top = "0";
        this.svg.setAttribute('width', svgWidth + '');
        this.svg.setAttribute('height', svgHeight + '');
        this.domElement.appendChild(this.svg);
        //this.enableSVGPaint(false);
        this.svgGroup = CLOUD.Extensions.Utils.Shape2D.createSvgElement('g');
        this.svg.insertBefore(this.svgGroup, this.svg.firstChild);
    }
    this.initialized = true;
};
CLOUD.Extensions.MarkerEditor.prototype.uninit = function () {
    this.initialized = false;
    if (!this.svg) return;
    // 卸载数据
    this.unloadMarkers();
    if (this.svgGroup && this.svgGroup.parentNode) {
        this.svgGroup.parentNode.removeChild(this.svgGroup);
    }
    if (this.svg.parentNode) {
        this.svg.parentNode.removeChild(this.svg);
    }
    this.svgGroup = null;
    this.svg = null;
    this.markerClickCallback = null;
};
CLOUD.Extensions.MarkerEditor.prototype.isInitialized = function () {
    return this.initialized;
};
// 生成标识ID
CLOUD.Extensions.MarkerEditor.prototype.generateMarkerId = function () {
    ++this.nextMarkerId;
    var id = this.nextMarkerId.toString(10);
    //var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    //    return v.toString(16);
    //});
    return id;
};
// 清除数据
CLOUD.Extensions.MarkerEditor.prototype.clear = function () {
    var markers = this.markers;
    while (markers.length) {
        var marker = markers[0];
        this.deleteMarker(marker);
    }
    var group = this.svgGroup;
    if (group && group.childNodes.length > 0) {
        while (group.childNodes.length) {
            group.removeChild(group.childNodes[0]);
        }
    }
};
// 增加
CLOUD.Extensions.MarkerEditor.prototype.addMarker = function (marker) {
    marker.setParent(this.svgGroup);
    this.markers.push(marker);
};
// 删除
CLOUD.Extensions.MarkerEditor.prototype.deleteMarker = function (marker) {
    if (marker) {
        var idx = this.markers.indexOf(marker);
        if (idx !== -1) {
            this.markers.splice(idx, 1);
        }
        marker.destroy();
    }
};
// 选中
CLOUD.Extensions.MarkerEditor.prototype.selectMarker = function (marker) {
    if (this.selectedMarker !== marker) {
        this.deselectMarker();
        this.selectedMarker = marker;
    } else {
        
        // 取消选择
        this.deselectMarker();
    }
    // click 回调
    if (this.markerClickCallback) {
        if (this.selectedMarker) {
            this.markerClickCallback(this.selectedMarker.toNewObject());
        } else {
            this.markerClickCallback(null);
        }
    }
};
// 取消选中
CLOUD.Extensions.MarkerEditor.prototype.deselectMarker = function () {
    if (this.selectedMarker) {
        this.selectedMarker.deselect();
        this.selectedMarker = null;
    }
};
// 获得主场景构件根节点变换矩阵
CLOUD.Extensions.MarkerEditor.prototype.getSceneMatrix = function () {
    return this.scene.getMatrixGlobal();
};
// 获得主场景构件根节点变换矩阵的逆
CLOUD.Extensions.MarkerEditor.prototype.getInverseSceneMatrix = function () {
    var sceneMatrix = this.getSceneMatrix();
    var inverseMatrix = new THREE.Matrix4();
    inverseMatrix.getInverse(sceneMatrix);
    return inverseMatrix;
};
// 世界坐标转屏幕坐标
CLOUD.Extensions.MarkerEditor.prototype.worldToClient = function (wPoint) {
    var bounds = this.getDomContainerBounds();
    var camera = this.cameraControl.camera;
    var sceneMatrix = this.getSceneMatrix();
    var result = new THREE.Vector3(wPoint.x, wPoint.y, wPoint.z);
    result.applyMatrix4(sceneMatrix);
    result.project(camera);
    // 裁剪不在相机范围的值
    if (Math.abs(result.z) > 1) {
        return null;
    }
    result.x = Math.round(0.5 * (result.x + 1) * bounds.width);
    result.y = Math.round(-0.5 * (result.y - 1) * bounds.height);
    result.z = 0;
    return result;
};
// 屏幕坐标转世界坐标
CLOUD.Extensions.MarkerEditor.prototype.clientToWorld = function (cPoint) {
    var bounds = this.getDomContainerBounds();
    var camera = this.cameraControl.camera;
    var result = new THREE.Vector3();
    result.x = cPoint.x / bounds.width * 2 - 1;
    result.y = -cPoint.y / bounds.height * 2 + 1;
    result.z = 0;
    result.unproject(camera);
    var inverseMatrix = this.getInverseSceneMatrix();
    result.applyMatrix4(inverseMatrix);
    return result;
};
// 屏幕坐标转规范化坐标
CLOUD.Extensions.MarkerEditor.prototype.clientToViewport = function (cPoint) {
    var bounds = this.getDomContainerBounds();
    var result = new THREE.Vector3();
    result.x = cPoint.x / bounds.width * 2 - 1;
    result.y = -cPoint.y / bounds.height * 2 + 1;
    result.z = 0;
    return result;
};
// 是否允许在SVG上绘图
CLOUD.Extensions.MarkerEditor.prototype.enableSVGPaint = function (enable) {
    if (enable) {
        this.svg && this.svg.setAttribute("pointer-events", "painted");
    } else {
        this.svg && this.svg.setAttribute("pointer-events", "none");
    }
};
// 获得容器边框
CLOUD.Extensions.MarkerEditor.prototype.getDomContainerBounds = function () {
    return CLOUD.DomUtil.getContainerOffsetToClient(this.domElement);
};
// 根据形状和状态获得颜色
CLOUD.Extensions.MarkerEditor.prototype.getMarkerColor = function (shape, state) {
    var markerColor = this.bubbleColors.red;
    if (shape < 0 && shape > 1) {
        shape = 0;
    }
    // 兼容以前的模式（0 - 5）
    if (state > 2) {
        state -= 3;
    }
    if (state < 0 && state > 2) {
        state = 0;
    }
    switch (state) {
        case 0:
            if (shape === 0) {
                markerColor = this.bubbleColors.red;
            } else {
                markerColor = this.flagColors.red;
            }
            break;
        case 1:
            if (shape === 0) {
                markerColor = this.bubbleColors.green;
            } else {
                markerColor = this.flagColors.green;
            }
            break;
        case 2:
            if (shape === 0) {
                markerColor = this.bubbleColors.gray;
            } else {
                markerColor = this.flagColors.yellow;
            }
            break;
    }
    return markerColor;
};
// 根据Pick对象信息创建标记
CLOUD.Extensions.MarkerEditor.prototype.createMarkerByIntersect = function (intersect, shapeType, state) {
    var id = this.generateMarkerId();//intersect.userId;
    var userId = intersect.userId;
    var position = intersect.worldPosition || intersect.object.point;
    var boundingBox = intersect.worldBoundingBox || intersect.object.boundingBox;
    var markerInfo = {
        id: id,
        userId: userId,
        position: position,
        boundingBox: boundingBox,
        shapeType: shapeType,
        state: state
    };
    this.createMarker(markerInfo);
};
// 创建标记
CLOUD.Extensions.MarkerEditor.prototype.createMarker = function (markerInfo) {
    if (!markerInfo) return;
    var style = CLOUD.Extensions.Marker.getDefaultStyle();
    style['fill-color'] = this.getMarkerColor(markerInfo.shapeType, markerInfo.state);
    var markerId = markerInfo.id;   //this.generateMarkerId();
    var marker;
    if (CLOUD.Extensions.Marker.shapeTypes.BUBBLE === markerInfo.shapeType) {
        marker = new CLOUD.Extensions.MarkerBubble(markerId, this);
    } else if (CLOUD.Extensions.Marker.shapeTypes.FLAG === markerInfo.shapeType) {
        marker = new CLOUD.Extensions.MarkerFlag(markerId, this);
    }
    else {
        marker = new CLOUD.Extensions.MarkerCommon(markerId, this, markerInfo.state);
    }
    marker.set(markerInfo.userId, markerInfo.position, markerInfo.boundingBox, style);
    this.addMarker(marker);
};
// ---------------------------- 外部 API BEGIN ---------------------------- //
// 获得所有marker的包围盒
CLOUD.Extensions.MarkerEditor.prototype.getMarkersBoundingBox = function () {
    if (this.markers.length < 1) return null;
    var bBox = new THREE.Box3();
    for (var i = 0, len = this.markers.length; i < len; i++) {
        var marker = this.markers[i];
        bBox.union(marker.getBoundingBox());
    }
    return bBox;
};
// 获得marker列表
CLOUD.Extensions.MarkerEditor.prototype.getMarkerInfoList = function () {
    var markerInfoList = [];
    for (var i = 0, len = this.markers.length; i < len; i++) {
        var marker = this.markers[i];
        var tmpId = marker.userId + "_" + i;
        var info = {
            id: marker.id || tmpId,
            userId: marker.userId,
            shapeType: marker.shapeType,
            position: marker.position,
            boundingBox: marker.boundingBox,
            state: marker.state
        };
        markerInfoList.push(info);
    }
    return markerInfoList;
};
// 加载
CLOUD.Extensions.MarkerEditor.prototype.loadMarkers = function (markers) {
    
    // 清除数据
    this.clear();
    for (var i = 0, len = markers.length; i < len; i++) {
        var info = markers[i];
        var tmpId = info.userId + "_" + i;
        var id = info.id || tmpId;
        var userId = info.userId;
        var shapeType = info.shapeType;
        var state = info.state;
        var position = info.position;
        var boundingBox = new THREE.Box3();
        boundingBox.max.x = info.boundingBox.max.x;
        boundingBox.max.y = info.boundingBox.max.y;
        boundingBox.max.z = info.boundingBox.max.z;
        boundingBox.min.x = info.boundingBox.min.x;
        boundingBox.min.y = info.boundingBox.min.y;
        boundingBox.min.z = info.boundingBox.min.z;
        var markerInfo = {
            id: id,
            userId: userId,
            position: position,
            boundingBox: boundingBox,
            shapeType: shapeType,
            state: state
        };
        this.createMarker(markerInfo);
    }
};
// 根据Pick对象信息加载
CLOUD.Extensions.MarkerEditor.prototype.loadMarkersFromIntersect = function (intersect, shapeType, state) {
    
    // 清除数据
    this.clear();
    this.createMarkerByIntersect(intersect, shapeType, state);
};
// 卸载
CLOUD.Extensions.MarkerEditor.prototype.unloadMarkers = function () {
    
    // 清除数据
    this.clear();
};
// 更新所有
CLOUD.Extensions.MarkerEditor.prototype.updateMarkers = function () {
    for (var i = 0, len = this.markers.length; i < len; i++) {
        var marker = this.markers[i];
        marker.update();
    }
};
//// 显示
//CLOUD.Extensions.MarkerEditor.prototype.showMarkers = function () {
//
//    if (this.svgGroup) {
//        this.svgGroup.setAttribute("visibility", "visible");
//    }
//};
//
//// 隐藏
//CLOUD.Extensions.MarkerEditor.prototype.hideMarkers = function () {
//
//    if (this.svgGroup) {
//        this.svgGroup.setAttribute("visibility", "hidden");
//    }
//};
// 根据ID获得marker
CLOUD.Extensions.MarkerEditor.prototype.getMarker = function (id) {
    var markers = this.markers;
    var count = markers.length;
    for (var i = 0; i < count; ++i) {
        if (markers[i].id == id) {
            return markers[i];
        }
    }
    return null;
};
// 设置marker选中回调
CLOUD.Extensions.MarkerEditor.prototype.setMarkerClickCallback = function (callback) {
    this.markerClickCallback = callback;
};
// ---------------------------- 外部 API END ---------------------------- //
/**
 * 小地图批注辅助类
 * @class  CLOUD.Extensions.MiniMapHelper
 * @param {Object} viewer- 模型浏览类对象
 */
CLOUD.Extensions.MiniMapHelper = function (viewer) {
    "use strict";
    this.viewer = viewer;
    this.miniMaps = {};
    this.defaultMiniMap = null;
};
/**
 * @lends CLOUD.Extensions.MiniMapHelper.prototype
 *
 */
CLOUD.Extensions.MiniMapHelper.prototype = {
    constructor: CLOUD.Extensions.MiniMapHelper,
    /**
     * 释放资源
     *
     */
    destroy: function () {
        
        // TODO: clear other resources.
        this.destroyAllMiniMap();
        this.viewer = null;
        this.miniMaps = {};
        this.defaultMiniMap = null;
    },
    // ------------------ 小地图API -- S ------------------ //
    /**
     * 创建小地图
     *
     * @param {String} name - 小地图名
     * @param {HTMLElement} domElement - 父容器
     * @param {Number} width - 小地图宽度
     * @param {Number} height - 小地图高度
     * @param {Object} styleOptions - 小地图显示风格
     * @param {function(Object)} callbackCameraChanged - 相机变化回调
     *                                                      ({
     *                                                      position: position,
     *                                                      isInScene : isInScene,
     *                                                      axis: {
     *                                                          abcName: abcName,
     *                                                          numeralName: numeralName,
     *                                                          offsetX: offsetX,
     *                                                          offsetY: offsetY,
     *                                                          offsetZ: offsetZ,
     *                                                          infoX: axisInfoX,
     *                                                          infoY: axisInfoY
     *                                                          }
     *                                                      })
     * @param {function(Object)} callbackClickOnAxisGrid - click 回调
     *                                                      ({
     *                                                          position: position,
     *                                                          abcName: abcName,
     *                                                          numeralName: numeralName,
     *                                                          offsetX: offsetX,
     *                                                          offsetY: offsetY
     *                                                       })
     */
    createMiniMap: function (name, domElement, width, height, styleOptions, callbackCameraChanged, callbackClickOnAxisGrid) {
        var miniMap = this.miniMaps[name];
        if (!miniMap) {
            miniMap = this.miniMaps[name] = new CLOUD.MiniMap(this.viewer);
            miniMap.setCameraChangedCallback(callbackCameraChanged);
            miniMap.setClickOnAxisGridCallback(callbackClickOnAxisGrid);
        }
        domElement = domElement || this.viewer.domElement;
        if (domElement) {
            // 初始化小地图
            miniMap.init(domElement, width, height, styleOptions);
        }
        if (!this.defaultMiniMap) {
            this.defaultMiniMap = this.miniMaps[name];
        }
        //return this.miniMaps[name];
    },
    /**
     *  销毁小地图
     *
     * @param {String} name - 小地图名
     */
    destroyMiniMap: function (name) {
        var miniMap = this.miniMaps[name];
        if (miniMap) {
            miniMap.uninit();
            if (this.defaultMiniMap === miniMap) {
                this.defaultMiniMap = null;
            }
            delete this.miniMaps[name];
        }
    },
    /**
     * 销毁所有小地图资源
     *
     */
    destroyAllMiniMap: function () {
        for (var name in this.miniMaps) {
            this.destroyMiniMap(name);
        }
    },
    /**
     * 将小地图容器从主容器中移除
     *
     * @param {String} name - 小地图名
     */
    removeMiniMap: function (name) {
        var miniMap = this.miniMaps[name];
        if (miniMap) {
            miniMap.remove();
            //delete this.miniMaps[name];
        }
    },
    /**
     * 将小地图容器附加到主容器中
     *
     * @param {String} name - 小地图名
     */
    appendMiniMap: function (name) {
        var miniMap = this.miniMaps[name];
        if (miniMap) {
            miniMap.append();
        }
    },
    /**
     * 获得所有的小地图对象
     *
     */
    getMiniMaps: function () {
        return this.miniMaps;
    },
    /**
     * 获得小地图对象
     *
     * @param {String} name - 小地图名
     */
    getMiniMap: function (name) {
        return this.miniMaps[name];
    },
    /**
     * 绘制小地图
     *
     */
    renderMiniMap: function () {
        for (var name in this.miniMaps) {
            var miniMap = this.miniMaps[name];
            if (miniMap) {
                miniMap.render();
            }
        }
    },
    /**
     * 设置平面图
     *
     * @param {Object} jsonObj - 平面图数据对象
     */
    setFloorPlaneData: function (jsonObj) {
        CLOUD.MiniMap.setFloorPlaneData(jsonObj);
    },
    /**
     * 构造平面图
     *
     * @param {String} name - 小地图名
     * @param {Boolean} [changeView] - 是否改变视角
     */
    generateFloorPlane: function (name, changeView) {
        var miniMap = this.miniMaps[name];
        if (miniMap) {
            miniMap.generateFloorPlane(changeView);
        }
    },
    /**
     * 设置轴网数据
     *
     * @param {Object} jsonObj - 轴网数据对象
     * @param {Number} [level] - 未使用
     */
    setAxisGridData: function (jsonObj, level) {
        CLOUD.MiniMap.setAxisGridData(jsonObj);
    },
    /**
     * 构造轴网
     *
     * @param {String} name - 小地图名
     */
    generateAxisGrid: function (name) {
        var miniMap = this.miniMaps[name];
        if (miniMap) {
            miniMap.generateAxisGrid();
        }
    },
    /**
     * 是否显示隐藏轴网
     *
     * @param {String} name - 小地图名
     * @param {Boolean} enable - 是否显示隐藏， true: 显示， false：隐藏
     */
    showAxisGrid: function (name, show) {
        var miniMap = this.miniMaps[name];
        if (miniMap) {
            if (show) {
                miniMap.showAxisGird();
            } else {
                miniMap.hideAxisGird();
            }
        }
    },
    /**
     * 是否允许触发轴网事件
     *
     * @param {String} name - 小地图名
     * @param {Boolean} enable - 是否允许
     */
    enableAxisGridEvent: function (name, enable) {
        var miniMap = this.miniMaps[name];
        if (miniMap) {
            miniMap.enableMouseEvent(enable);
        }
    },
    /**
     * 是否允许显示相机光标
     *
     * @param {String} name - 小地图名
     * @param {Boolean} enable - 是否允许显示
     */
    enableMiniMapCameraNode: function (name, enable) {
        var miniMap = this.miniMaps[name];
        if (miniMap) {
            miniMap.enableCameraNode(enable);
        }
    },
    /**
     * 根据轴号定位
     *
     * @param {String} name - 小地图名
     * @param {String} abcName - 字母轴号
     * @param {String} numeralName - 数字轴号
     */
    flyBypAxisGridNumber: function (name, abcName, numeralName) {
        console.warn('CLOUD.Extensions.MiniMapHelper.flyBypAxisGridNumber() has been deprecated. Use CLOUD.Extensions.MiniMapHelper.flyByAxisGridNumber() instead.');
        return this.flyByAxisGridNumber(name, abcName, numeralName);
    },
    /**
     * 根据轴号定位
     *
     * @param {String} name - 小地图名
     * @param {String} abcName - 字母轴号
     * @param {String} numeralName - 数字轴号
     */
    flyByAxisGridNumber: function (name, abcName, numeralName) {
        var miniMap = this.miniMaps[name];
        if (miniMap) {
            return miniMap.flyByAxisGridNumber(abcName, numeralName);
        }
        return false;
    },
    /**
     * 根据指定点获得轴网信息(变换后的点, 一般来着pick点)
     *
     * @param {THREE.Vector3} point - 指定构件包围盒
     */
    getAxisGridInfoByPoint: function (point) {
        var defaultMiniMap = this.defaultMiniMap;
        var axisGridInfo = null;
        if (defaultMiniMap) {
            axisGridInfo = defaultMiniMap.getAxisGridInfoByPoint(point);
        }
        return axisGridInfo;
    },
    /**
     * 根据相交信息获得轴网信息
     *
     * @param {Object} intersect - 相交信息对象, 来源pick
     */
    getAxisGridInfoByIntersect: function (intersect) {
        var defaultMiniMap = this.defaultMiniMap;
        if (defaultMiniMap) {
            intersect.axisGridInfo = defaultMiniMap.getAxisGridInfoByPoint(intersect.point);
        }
    },
    /**
     * 重置小地图大小
     *
     * @param {string} name - 小地图标识名
     * @param {number} width - 宽度
     * @param {number} height - 高度
     */
    resize: function (name, width, height) {
        var miniMap = this.miniMaps[name];
        if (miniMap) {
            miniMap.resize(name, width, height);
        }
    }
    
    // ------------------ 小地图API -- E ------------------ //
};
/**
 * 标注辅助类
 * @class  CLOUD.Extensions.MarkerHelper
 * @param {Object} viewer - 模型浏览类对象
 */
CLOUD.Extensions.MarkerHelper = function (viewer) {
    this.viewer = viewer;
    this.markerClickCallback = null;
};
/**
 * @lends CLOUD.Extensions.MarkerHelper.prototype
 *
 */
CLOUD.Extensions.MarkerHelper.prototype = {
    constructor: CLOUD.Extensions.MarkerHelper,
    /**
     * 释放资源
     *
     */
    destroy: function () {
        this.uninitMarkerEditor();
        this.markerEditor = null;
        this.markerClickCallback = null;
        this.viewer = null;
    },
    /**
     * 初始化Marker
     *
     */
    initMarkerEditor: function () {
        var viewer = this.viewer;
        if (!this.markerEditor) {
            this.markerEditor = new CLOUD.Extensions.MarkerEditor(viewer);
        }
        if (!this.markerEditor.isInitialized()) {
            this.markerEditor.init();
        }
        if (this.markerClickCallback) {
            this.markerEditor.setMarkerClickCallback(this.markerClickCallback);
        }
    },
    /**
     * 卸载Marker
     *
     */
    uninitMarkerEditor: function () {
        if (this.markerEditor && this.markerEditor.isInitialized()) {
            this.markerEditor.uninit();
        }
    },
    /**
     * zoom 到  markers 包围盒大小
     *
     */
    zoomToSelectedMarkers: function () {
        if (this.markerEditor) {
            var bBox = this.markerEditor.getMarkersBoundingBox();
            if (bBox) {
                this.viewer.zoomToBBox(bBox, 0.05);
            }
            this.markerEditor.updateMarkers();
        }
    },
    /**
     * 加载标记
     *
     * @param {Array} markerInfoList - marker 列表
     */
    loadMarkers: function (markerInfoList) {
        if (markerInfoList) {
            this.initMarkerEditor();
            this.markerEditor.loadMarkers(markerInfoList);
        } else {
            this.uninitMarkerEditor();
        }
    },
    /**
     * 从picker中加载标记
     *
     * @param {Object} intersect - pick 选点
     * @param {Number} shapeType - 形状类型 ({BUBBLE: 0, FLAG: 1, COMMON:2})
     * @param {Number} state - 颜色状态
     */
    loadMarkersFromIntersect: function (intersect, shapeType, state) {
        if (intersect) {
            this.initMarkerEditor();
            this.markerEditor.loadMarkersFromIntersect(intersect, shapeType, state);
        } else {
            this.uninitMarkerEditor();
        }
    },
    /**
     * 获得标记列表
     *
     */
    getMarkerInfoList: function () {
        if (this.markerEditor) {
            return this.markerEditor.getMarkerInfoList();
        }
        return null;
    },
    /**
     * resize
     *
     */
    resizeMarkers: function () {
        if (this.markerEditor) {
            return this.markerEditor.onResize();
        }
    },
    /**
     * 绘制 markers
     *
     */
    renderMarkers: function () {
        if (this.markerEditor) {
            return this.markerEditor.updateMarkers();
        }
    },
    /**
     * 获得所有 marker 的包围盒
     *
     */
    getMarkersBoundingBox: function () {
        if (this.markerEditor) {
            return this.markerEditor.getMarkersBoundingBox();
        }
    },
    /**
     * 根据 id 选中 marker
     *
     * @param {String} id - marker id
     */
    selectMarkerById: function (id) {
        if (this.markerEditor) {
            var marker = this.markerEditor.getMarker(id);
            marker.highlight(true);
            this.markerEditor.selectMarker(marker);
        }
    },
    /**
     * 设置marker click 回调
     *
     * @param {function(Object)} callback - 回调函数
     * @param {Object} callback(Object) - 回调函数参数 ({id: id, userId: userId, shapeType: shapeType, position: position, boundingBox: boundingBox})
     */
    setMarkerClickCallback: function (callback) {
        this.markerClickCallback = callback;
    }
};
/**
 * DWG批注辅助类
 * @class  CLOUD.Extensions.DwgHelper
 * @param {Object} options - 特定的操作对象, 例如指定回调函数 options.popupCallback
 */
CLOUD.Extensions.DwgHelper = function (options) {
    "use strict";
    this.dwgContainer = null;
    this.annotationContainer = null;
    this.defaultStyle = {
        'stroke-width': 3,
        'stroke-color': '#ff0000',
        'stroke-opacity': 1.0,
        'fill-color': '#ff0000',
        'fill-opacity': 0.0,
        'font-family': 'Arial',
        'font-size': 16,
        'font-style': '',
        'font-weight': ''
    };
    this.isDblClickCloseCloud = true;
    this.options = options;
};
/**
 * @lends CLOUD.Extensions.DwgHelper.prototype
 *
 */
CLOUD.Extensions.DwgHelper.prototype = {
    constructor: CLOUD.Extensions.DwgHelper,
    /**
     * 释放资源
     *
     */
    destroy: function () {
        this.uninitAnnotation();
        this.editor = null;
        this.dwgContainer = null;
        this.annotationContainer = null;
        this.options = null;
    },
    /**
     * 设置DWG批注容器, 在使用批注功能前，需要先设置dom容器
     *
     * @param {HTMLElement} dwgContainer - dwg 图纸容器
     * @param {HTMLElement} domContainer - 绘制批注的主容器
     */
    setDomContainer: function (dwgContainer, annotationContainer) {
        this.dwgContainer = dwgContainer;
        if (annotationContainer) {
            this.annotationContainer = annotationContainer;
        } else {
            this.annotationContainer = dwgContainer;
        }
    },
    /**
     * 初始化DWG批注
     *
     * @param {function(domElement)} [beginEditCallback] - 开始编辑时回调函数
     * @param {function(domElement)} [endEditCallback] - 结束编辑时回调函数
     */
    initAnnotation: function (beginEditCallback, endEditCallback) {
        var scope = this;
        var domElement = this.annotationContainer;
        var options = this.options;
        if (!this.editor) {
            this.editor = new CLOUD.Extensions.AnnotationEditor2D(domElement, options);
        } else {
            
            // 设置父容器
            this.editor.setDomContainer(domElement);
        }
        this.editor.enableDblClickCloseCloud(this.isDblClickCloseCloud);
        if (!this.editor.isInitialized()) {
            var callbacks = {
                beginEditCallback: beginEditCallback,
                endEditCallback: endEditCallback,
                changeEditorModeCallback: function () {
                    scope.uninitAnnotation();
                }
            };
            this.editor.init(callbacks);
            this.editor.setSvgZIndex();
            callbacks = null;
        }
    },
    /**
     * 卸载DWG批注资源
     *
     */
    uninitAnnotation: function () {
        if (this.editor && this.editor.isInitialized()) {
            this.editor.uninit();
        }
    },
    /**
     * 设置背景色，支持过渡色
     *
     * @param {Color} [startColor] - 过渡色1（16进制颜色值）
     * @param {Color} [stopColor] - 过渡色2 （16进制颜色值）
     */
    setAnnotationBackgroundColor: function (startColor, stopColor) {
        if (this.editor) {
            this.editor.setBackgroundColor(startColor, stopColor);
        }
    },
    /**
     * 开始编辑DWG批注
     *
     * @param {Object} [pointToCenter] - 绝对基准点 {x: x, y: y}, 相对于某个可参考的绝对位置点(根据情况选定)。如果 absBasePoint 未定义，则默认为 {x: 0, y: 0}
     * @param {function(domElement)} [beginEditCallback] - 开始编辑时回调函数
     * @param {function(domElement)} [endEditCallback] - 结束编辑时回调函数
     */
    editAnnotationBegin: function (pointToCenter, beginEditCallback, endEditCallback) {
        
        // 如果没有设置批注模式，则自动进入批注模式
        this.initAnnotation(beginEditCallback, endEditCallback);
        if (pointToCenter) {
            this.editor.setAbsoluteBasePoint(pointToCenter);
        }
        this.editor.editBegin();
    },
    /**
     * 完成编辑
     *
     */
    editAnnotationEnd: function () {
        if (this.editor) {
            this.editor.editEnd();
        }
    },
    /**
     * 设置批注类型
     *
     * @param {Int} type - 批注类型（{ARROW: 0, RECTANGLE: 1, CIRCLE: 2, CROSS: 3, CLOUD: 4, TEXT: 5}）
     */
    setAnnotationType: function (type) {
        if (this.editor) {
            this.editor.setAnnotationType(type);
        }
    },
    /**
     * 设置批注风格
     *
     * @param {Object} style - 批注风格 （{'stroke-width': 3,'stroke-color': '#ff0000','stroke-opacity': 1.0,'fill-color': '#ff0000', 'font-size': 16}）
     * @param {Object} [updateText] - 是否刷新文本风格
     */
    setAnnotationStyle: function (style, updateText) {
        if (this.editor) {
            for (var attr in style) {
                if (attr in this.defaultStyle) {
                    this.defaultStyle[attr] = style[attr];
                }
            }
            this.editor.setAnnotationStyle(this.defaultStyle, updateText);
        }
    },
    /**
     * 加载批注
     *
     * @param {Array} [annotations] - 批注列表
     *                          ({  id: id,
     *                              shapeType: shapeType,
     *                              position: position,
     *                              size: size,
     *                              rotation: rotation,
     *                              shapePoints: shapePoints,
     *                              originSize: originSize,
     *                              style: style,
     *                              text: text
     *                          })
     * @param {Object} [absBasePoint] - 绝对基准点 {x: x, y: y}, 相对于某个可参考的绝对位置点(根据情况选定)。如果 absBasePoint 未定义，则默认为 {x: 0, y: 0}
     * @param {function(domElement)} [beginEditCallback] - 开始编辑时回调函数
     * @param {function(domElement)} [endEditCallback] - 结束编辑时回调函数
     */
    loadAnnotations: function (annotations, absBasePoint, beginEditCallback, endEditCallback) {
        if (annotations) {
            this.initAnnotation(beginEditCallback, endEditCallback);
            if (absBasePoint) {
                this.editor.setAbsoluteBasePoint(absBasePoint);
            }
            this.editor.loadAnnotations(annotations);
        } else {
            this.uninitAnnotation();
        }
    },
    /**
     * 获得批注对象列表
     *
     * @return {Array} 批注对象列表
     */
    getAnnotationInfoList: function () {
        if (this.editor) {
            return this.editor.getAnnotationInfoList();
        }
        return null;
    },
    /**
     * resize
     *
     */
    resizeAnnotations: function () {
        if (this.editor && this.editor.isInitialized()) {
            this.editor.onResize();
        }
    },
    /**
     * 状态变化 - 清除批注
     *
     */
    clearAnnotations: function () {
        if (this.editor && this.editor.isInitialized()) {
            this.editor.onCameraChange();
        }
    },
    /**
     * 特殊处理 - 是否允许双击关闭云图批注
     *
     * @param {Boolean} enable - 是否允许双击封闭云图, true:允许
     */
    enableDblClickCloseCloud: function (enable) {
        this.isDblClickCloseCloud = enable;
    },
    /**
     * 截屏 base64 格式png图片
     *
     * @param {function(data)} snapshotCallback - 回调
     */
    captureAnnotationsScreenSnapshot: function (snapshotCallback) {
        var scope = this;
        var isInitialized = this.editor && this.editor.isInitialized();
        var dwgDom = this.dwgContainer;
        if (!dwgDom || !isInitialized) {
            snapshotCallback(null);
            return;
        }
        html2canvas(dwgDom, {
            logging: true,
            onrendered: function (canvas) {
                var dataUrl = canvas.toDataURL("image/png");
                // fixed bug: 在chrome 版本 57.0.2987.133 (64-bit)上截不到图，采用回调函数处理。
                // dataUrl = scope.editor.getScreenSnapshot(dataUrl);
                // snapshotCallback(dataUrl);
                scope.editor.getScreenSnapshot(dataUrl, snapshotCallback);
            }
        });
    },
    /**
     * 截屏 base64 格式png图片
     *
     * @param {function(data)} snapshotCallback - 回调
     */
    canvas2image: function (snapshotCallback) {
        
        // DWG不能直接返回截屏图片，故这种方式处理不了DWG，回调函数解决
        //var snapshotCallback = function(dataUrl) {
        //
        //    var win = window.open();
        //    var img = new Image();
        //    img.onload = function () {
        //        img.onload = null;
        //        win.document.body.appendChild(img);
        //    };
        //    img.onerror = function () {
        //        img.onerror = null;
        //        if (console.log) {
        //            console.log("Not loaded image from canvas.toDataURL");
        //        } else {
        //            alert("Not loaded image from canvas.toDataURL");
        //        }
        //    };
        //
        //    img.src = dataUrl;
        //};
        this.captureAnnotationsScreenSnapshot(snapshotCallback);
    },
    /**
     * 设置绝对基准点
     *
     * @param {Object} point - 相对某一个绝对位置点的坐标
     */
    setAbsoluteBasePoint: function (point) {
        
        // 如果初始化，则自动初始化
        this.initAnnotation();
        if (point) {
            this.editor.setAbsoluteBasePoint(point);
        }
    },
    /**
     * 设置屏幕基准点
     *
     * @param {Object} point - 相对 SVG 容器的坐标
     */
    setScreenBasePoint: function (point) {
        
        // 如果初始化，则自动初始化
        this.initAnnotation();
        if (point) {
            this.editor.setScreenBasePoint(point);
        }
    },
    /**
     * 设置缩放比例
     *
     * @param {Float} factorX - x 方向缩放因子
     * @param {Float} factorY - y 方向缩放因子
     */
    setZoomFactor: function (factorX, factorY) {
        factorY = factorY || factorX;
        // 如果初始化，则自动初始化
        this.initAnnotation();
        this.editor.setZoomFactor(factorX, factorY);
    },
    /**
     * 设置文字批注文本内容
     *
     * @param {string} text - 弹窗文本
     */
    setTextFromPopupBox: function (text) {
        if (this.editor) {
            this.editor.setTextFromPopupBox(text);
        }
    },
    /**
     * 取消文字批注文本内容设置
     *
     */
    unsetTextFromPopupBox: function () {
        if (this.editor) {
            this.editor.unsetTextFromPopupBox();
        }
    }
};
/**
 * 2D批注辅助类
 * @class  CLOUD.Extensions.AnnotationHelper2D
 * @param {Object} options - 特定的操作对象, 例如指定回调函数 options.popupCallback
 */
CLOUD.Extensions.AnnotationHelper2D = function (options) {
    "use strict";
    this.domContainer = null;
    this.defaultStyle = {
        'stroke-width': 3,
        'stroke-color': '#ff0000',
        'stroke-opacity': 1.0,
        'fill-color': '#ff0000',
        'fill-opacity': 0.0,
        'font-family': 'Arial',
        'font-size': 16,
        'font-style': '',
        'font-weight': ''
    };
    this.isDblClickCloseCloud = false;
    this.options = options;
};
/**
 * @lends CLOUD.Extensions.AnnotationHelper2D.prototype
 *
 */
CLOUD.Extensions.AnnotationHelper2D.prototype = {
    constructor: CLOUD.Extensions.AnnotationHelper2D,
    /**
     * 释放资源
     *
     */
    destroy: function () {
        this.uninitAnnotation();
        this.editor = null;
        this.domContainer = null;
        this.beginEditCallback = null;
        this.endEditCallback = null;
        this.stateChangeCallback = null;
        this.defaultStyle = null;
        this.options = null;
    },
    /**
     * 设置批注容器, 在使用批注功能前，需要先设置dom容器
     *
     * @param {HTMLElement} domContainer - 绘制批注的主容器
     */
    setDomContainer: function (domContainer) {
        this.domContainer = domContainer;
    },
    /**
     * 设置回调, 如果需要设置，在初始化之前设置
     *
     * @param {function(domElement)} [beginEditCallback] - 开始编辑时回调函数
     * @param {function(domElement)} [endEditCallback] - 结束编辑时回调函数
     * @param {function(domElement)} [stateChangeCallback] - 状态变化时（平移，旋转等操作）回调函数
     */
    setEditCallback: function (beginEditCallback, endEditCallback, stateChangeCallback) {
        this.beginEditCallback = beginEditCallback;
        this.endEditCallback = endEditCallback;
        this.stateChangeCallback = stateChangeCallback;
    },
    /**
     * 初始化, 不用显示调用
     *
     */
    initAnnotation: function () {
        var scope = this;
        var domElement = this.domContainer;
        var options = this.options;
        if (!this.editor) {
            this.editor = new CLOUD.Extensions.AnnotationEditor2D(domElement, options);
        } else {
            // 设置父容器
            this.editor.setDomContainer(domElement);
        }
        this.editor.enableDblClickCloseCloud(this.isDblClickCloseCloud);
        if (!this.editor.isInitialized()) {
            var callbacks = {
                beginEditCallback: scope.beginEditCallback,
                endEditCallback: scope.endEditCallback,
                changeEditorModeCallback: scope.stateChangeCallback
            };
            this.editor.init(callbacks);
            callbacks = null;
        }
    },
    /**
     * 卸载
     *
     */
    uninitAnnotation: function () {
        if (this.editor && this.editor.isInitialized()) {
            this.editor.uninit();
        }
    },
    /**
     * 设置背景色，支持过渡色
     *
     * @param {Color} [startColor] - 过渡色1（16进制颜色值）
     * @param {Color} [stopColor] - 过渡色2 （16进制颜色值）
     */
    setAnnotationBackgroundColor: function (startColor, stopColor) {
        // 如果没有初始化，则自动初始化
        this.initAnnotation();
        this.editor.setBackgroundColor(startColor, stopColor);
    },
    /**
     * 开始编辑
     *
     * @param {Object} [absBasePoint] - 绝对基准点 {x: x, y: y}, 相对于某个可参考的绝对位置点(根据情况选定)。如果 absBasePoint 未定义，则默认为 {x: 0, y: 0}
     * @param {Object} [screenBasePoint] - 屏幕基准点 {x: x, y: y}, 相对于svg容器。 如果 screenBasePoint 未定义，则默认为svg容器的中心点
     * @param {Object} [zoomFactor] - 缩放比例 {x: x, y: y}
     * @remark absBasePoint 和 screenBasePoint 是同一个点在不同参照系下的表达
     */
    editAnnotationBegin: function (absBasePoint, screenBasePoint, zoomFactor) {
        // 如果没有初始化，则自动初始化
        this.initAnnotation();
        if (absBasePoint) {
            this.editor.setAbsoluteBasePoint(absBasePoint);
        }
        if (screenBasePoint) {
            this.editor.setScreenBasePoint(screenBasePoint);
        }
        if (zoomFactor) {
            this.editor.setZoomFactor(zoomFactor.x, zoomFactor.y);
        }
        this.editor.editBegin();
    },
    /**
     * 完成编辑
     *
     */
    editAnnotationEnd: function () {
        if (this.editor) {
            this.editor.editEnd();
        }
    },
    /**
     * 设置批注类型
     *
     * @param {Int} type - 批注类型（{ARROW: 0, RECTANGLE: 1, CIRCLE: 2, CROSS: 3, CLOUD: 4, TEXT: 5}）
     */
    setAnnotationType: function (type) {
        // 如果没有初始化，则自动初始化
        this.initAnnotation();
        this.editor.setAnnotationType(type);
    },
    /**
     * 设置批注风格
     *
     * @param {Object} style - 批注风格 （{'stroke-width': 3,'stroke-color': '#ff0000','stroke-opacity': 1.0,'fill-color': '#ff0000', 'font-size': 16}）
     * @param {Object} [updateText] - 是否刷新文本风格
     */
    setAnnotationStyle: function (style, updateText) {
        // 如果没有初始化，则自动初始化
        this.initAnnotation();
        for (var attr in style) {
            if (attr in this.defaultStyle) {
                this.defaultStyle[attr] = style[attr];
            }
        }
        this.editor.setAnnotationStyle(this.defaultStyle, updateText);
    },
    /**
     * 加载批注
     *
     * @param {Array} [annotations] - 批注列表
     *                          ({  id: id,
     *                              shapeType: shapeType,
     *                              position: position,
     *                              size: size,
     *                              rotation: rotation,
     *                              shapePoints: shapePoints,
     *                              originSize: originSize,
     *                              style: style,
     *                              text: text
     *                          })
     * @param {Object} [absBasePoint] - 绝对基准点 {x: x, y: y}, 相对于某个可参考的绝对位置点(根据情况选定)。如果 absBasePoint 未定义，则默认为 {x: 0, y: 0}
     * @param {Object} [screenBasePoint] - 屏幕基准点 {x: x, y: y}, 相对于svg容器。 如果 screenBasePoint 未定义，则默认为svg容器的中心点
     * @param {Object} [zoomFactor] - 缩放比例 {x: x, y: y}
     * @remark absBasePoint 和 screenBasePoint 是同一个点在不同参照系下的表达
     */
    loadAnnotations: function (annotations, absBasePoint, screenBasePoint, zoomFactor) {
        if (annotations) {
            // 如果没有初始化，则自动初始化
            this.initAnnotation();
            if (absBasePoint) {
                this.editor.setAbsoluteBasePoint(absBasePoint);
            }
            if (screenBasePoint) {
                this.editor.setScreenBasePoint(screenBasePoint);
            }
            if (zoomFactor) {
                this.editor.setZoomFactor(zoomFactor.x, zoomFactor.y);
            }
            this.editor.loadAnnotations(annotations);
        } else {
            this.uninitAnnotation();
        }
    },
    /**
     * 获得批注对象列表
     *
     * @return {Array} 批注对象列表
     */
    getAnnotationInfoList: function () {
        if (this.editor) {
            return this.editor.getAnnotationInfoList();
        }
        return null;
    },
    /**
     * 获得批注信息(带有包围盒信息)
     *
     * @return {Object} 批注信息 {boundingBox: boundingBox, annotations: annotations}
     */
    getAnnotationInfoListWithBox: function () {
        if (this.editor) {
            var annotationInfoList = this.editor.getAnnotationInfoList();
            if (annotationInfoList.length === 0) {
                return null;
            }
            var boundingBox = new THREE.Box2();
            // 计算包围盒
            for (var i = 0, len = annotationInfoList.length; i < len; i++) {
                var info = annotationInfoList[i];
                var shapeType = info.shapeType;
                var position = info.position;
                var size = info.size;
                var rotation = info.rotation || 0;
                if (shapeType === CLOUD.Extensions.Annotation.shapeTypes.ARROW) {
                    var dir = new THREE.Vector2(Math.cos(rotation), Math.sin(rotation));
                    dir.multiplyScalar(size.width * 0.5);
                    var center = new THREE.Vector2(position.x, position.y);
                    var tail = center.clone().sub(dir);
                    var head = center.clone().add(dir);
                    tail.y = -tail.y; // 注意: y值要取反，原因是坐标变换时取过反
                    head.y = -head.y;
                    boundingBox.expandByPoint(tail);
                    boundingBox.expandByPoint(head);
                } else {
                    var lt = new THREE.Vector2(position.x - 0.5 * size.width, -position.y - 0.5 * size.height);// 注意: y值要取反，原因是坐标变换时取过反
                    var rb = new THREE.Vector2(position.x + 0.5 * size.width, -position.y + 0.5 * size.height);// 注意: y值要取反，原因是坐标变换时取过反
                    boundingBox.expandByPoint(lt);
                    boundingBox.expandByPoint(rb);
                }
            }
            return {boundingBox: boundingBox, annotations: annotationInfoList};
        }
        return null;
    },
    /**
     * resize
     *
     */
    resizeAnnotations: function () {
        if (this.editor && this.editor.isInitialized()) {
            this.editor.onResize();
        }
    },
    /**
     * 状态变化
     *
     */
    renderAnnotations: function () {
        if (this.editor && this.editor.isInitialized()) {
            this.editor.onCameraChange();
        }
    },
    /**
     * 特殊处理 - 是否允许双击关闭云图批注
     *
     * @param {Boolean} enable - 是否允许双击封闭云图, true:允许
     */
    enableDblClickCloseCloud: function (enable) {
        this.isDblClickCloseCloud = enable;
    },
    /**
     * 截屏 base64 格式png图片
     * 在chrome 版本 57.0.2987.133 (64-bit)上截不到图，估计是图片异步加载的问题, 采用回调函数处理。
     *
     * @param {base64} dataUrl - base64 背景图
     * @param {function(data)} callback - 回调
     * @return 如果定义了callback，则直接返回null，截屏数据作为 callback 函数参数传入，所有需要获得截屏数据之后进行的操作，在callback中处理；
     *          如果没有定义callback, 则直接返回 base64位图片(可能截不到图)
     */
    captureAnnotationsScreenSnapshot: function (dataUrl, callback) {
        return this.editor.getScreenSnapshot(dataUrl, callback);
    },
    /**
     * 设置绝对基准点
     *
     * @param {Object} point - 相对某一个绝对位置点的坐标
     */
    setAbsoluteBasePoint: function (point) {
        // 如果初始化，则自动初始化
        this.initAnnotation();
        if (point) {
            this.editor.setAbsoluteBasePoint(point);
        }
    },
    /**
     * 设置屏幕基准点
     *
     * @param {Object} point - 相对 SVG 容器的坐标
     */
    setScreenBasePoint: function (point) {
        // 如果初始化，则自动初始化
        this.initAnnotation();
        if (point) {
            this.editor.setScreenBasePoint(point);
        }
    },
    /**
     * 设置缩放比例
     *
     * @param {Float} factorX - x 方向缩放因子
     * @param {Float} factorY - y 方向缩放因子
     */
    setZoomFactor: function (factorX, factorY) {
        factorY = factorY || factorX;
        // 如果初始化，则自动初始化
        this.initAnnotation();
        this.editor.setZoomFactor(factorX, factorY);
    },
    /**
     * 设置文字批注文本内容
     *
     * @param {string} text - 弹窗文本
     */
    setTextFromPopupBox: function (text) {
        if (this.editor) {
            this.editor.setTextFromPopupBox(text);
        }
    },
    /**
     * 取消文字批注文本内容设置
     *
     */
    unsetTextFromPopupBox: function () {
        if (this.editor) {
            this.editor.unsetTextFromPopupBox();
        }
    }
};
/**
 * 3D批注辅助类
 * @class  CLOUD.Extensions.AnnotationHelper3D
 * @param {Object} viewer - 模型浏览类对象
 * @param {Object} options - 特定的操作对象, 例如指定回调函数 options.popupCallback
 */
CLOUD.Extensions.AnnotationHelper3D = function (viewer, options) {
    "use strict";
    this.viewer = viewer;
    this.defaultStyle = {
        'stroke-width': 3,
        'stroke-color': '#ff0000',
        'stroke-opacity': 1.0,
        'fill-color': '#ff0000',
        'fill-opacity': 0.0,
        'font-family': 'Arial',
        'font-size': 16,
        'font-style': '',
        'font-weight': ''
    };
    this.isDblClickCloseCloud = true;
    this.resizeBind = this.resizeAnnotations.bind(this);
    this.renderBind = this.renderAnnotations.bind(this);
    this.options = options;
};
/**
 * @lends CLOUD.Extensions.AnnotationHelper3D.prototype
 *
 */
CLOUD.Extensions.AnnotationHelper3D.prototype = {
    constructor: CLOUD.Extensions.AnnotationHelper3D,
    /**
     * 释放资源
     *
     */
    destroy: function () {
        this.uninitAnnotation();
        this.editor = null;
        this.viewer = null;
        this.resizeBind = null;
        this.renderBind = null;
        this.options = null;
    },
    /**
     * 是否存在批注
     *
     */
    hasAnnotations: function () {
        return this.editor && this.editor.isInitialized();
    },
    /**
     * 初始化, 不用显示调用
     *
     */
    initAnnotation: function () {
        var viewer = this.viewer;
        var scope = this;
        var options = this.options;
        if (!this.editor) {
            this.editor = new CLOUD.Extensions.AnnotationEditor3D(viewer.domElement, viewer.camera, options);
        }
        this.editor.enableDblClickCloseCloud(this.isDblClickCloseCloud);
        if (!this.editor.isInitialized()) {
            var callbacks = {
                beginEditCallback: function (domElement) {
                    viewer.editorManager.unregisterDomEventListeners(domElement);
                },
                endEditCallback: function (domElement) {
                    viewer.editorManager.registerDomEventListeners(domElement);
                },
                changeEditorModeCallback: function () {
                    scope.uninitAnnotation();
                }
            };
            this.viewer.addCallbacks("resize", this.resizeBind);
            this.viewer.addCallbacks("render", this.renderBind);
            this.editor.init(callbacks);
            callbacks = null;
        }
    },
    /**
     * 卸载批注资源
     *
     */
    uninitAnnotation: function () {
        if (this.editor && this.editor.isInitialized()) {
            this.viewer.removeCallbacks("resize", this.resizeBind);
            this.viewer.removeCallbacks("render", this.renderBind);
            this.editor.uninit();
        }
    },
    /**
     * 设置背景色，支持过渡色
     *
     * @param {Color} [startColor] - 过渡色1（16进制颜色值）
     * @param {Color} [stopColor] - 过渡色2 （16进制颜色值）
     */
    setAnnotationBackgroundColor: function (startColor, stopColor) {
        if (this.editor) {
            this.editor.setBackgroundColor(startColor, stopColor);
        }
    },
    /**
     * 开始批注编辑
     *
     */
    editAnnotationBegin: function () {
        // 如果没有设置批注模式，则自动进入批注模式
        this.initAnnotation();
        this.editor.editBegin();
    },
    /**
     * 完成批注编辑
     *
     */
    editAnnotationEnd: function () {
        if (this.editor) {
            this.editor.editEnd();
        }
    },
    /**
     * 设置批注类型
     *
     * @param {Int} type - 批注类型（{ARROW: 0, RECTANGLE: 1, CIRCLE: 2, CROSS: 3, CLOUD: 4, TEXT: 5}）
     */
    setAnnotationType: function (type) {
        this.initAnnotation();
        this.editor.setAnnotationType(type);
    },
    /**
     * 设置批注风格
     *
     * @param {Object} style - 批注风格 （{'stroke-width': 3,'stroke-color': '#ff0000','stroke-opacity': 1.0,'fill-color': '#ff0000', 'font-size': 16}）
     * @param {Object} [updateText] - 是否刷新文本风格
     */
    setAnnotationStyle: function (style, updateText) {
        if (this.editor) {
            for (var attr in style) {
                if (attr in this.defaultStyle) {
                    this.defaultStyle[attr] = style[attr];
                }
            }
            this.editor.setAnnotationStyle(this.defaultStyle, updateText);
        }
    },
    /**
     * 加载批注列表
     *
     * @param {Array} [annotations] - 批注列表
     *                          ({  id: id,
     *                              shapeType: shapeType,
     *                              position: position,
     *                              size: size,
     *                              rotation: rotation,
     *                              shapePoints: shapePoints,
     *                              originSize: originSize,
     *                              style: style,
     *                              text: text
     *                          })
     */
    loadAnnotations: function (annotations) {
        if (annotations) {
            this.initAnnotation();
            this.editor.loadAnnotations(annotations);
        } else {
            this.uninitAnnotation();
        }
    },
    /**
     * 获得批注对象列表
     *
     * @return {Array} 批注对象列表
     */
    getAnnotationInfoList: function () {
        if (this.editor) {
            return this.editor.getAnnotationInfoList();
        }
        return null;
    },
    /**
     * resize
     *
     */
    resizeAnnotations: function () {
        if (this.editor && this.editor.isInitialized()) {
            this.editor.onResize();
        }
    },
    /**
     * 状态变化
     *
     */
    renderAnnotations: function () {
        if (this.editor && this.editor.isInitialized()) {
            this.editor.onCameraChange();
        }
    },
    /**
     * 特殊处理 - 是否允许双击关闭云图批注
     *
     * @param {Boolean} enable - 是否允许双击封闭云图, true:允许
     */
    enableDblClickCloseCloud: function (enable) {
        this.isDblClickCloseCloud = enable;
    },
    /**
     * 截屏 base64 格式png图片
     * 在chrome 版本 57.0.2987.133 (64-bit)上截不到图，估计是图片异步加载的问题, 采用回调函数处理。
     *
     * @param {base64} dataUrl - base64 背景图
     * @param {function(data)} callback - 回调
     * @return 如果定义了callback，则直接返回null，截屏数据作为 callback 函数参数传入，所有需要获得截屏数据之后进行的操作，在callback中处理；
     *          如果没有定义callback, 则直接返回 base64位图片(可能截不到图)
     */
    captureAnnotationsScreenSnapshot: function (backgroundClr, callback) {
        if (callback) {
            var scope = this;
            this.viewer.getRenderBufferScreenShot(backgroundClr, function (dataUrl) {
                scope.editor.getScreenSnapshot(dataUrl, callback);
            });
            return null;
        }
        // 这种方式在chrome 版本 57.0.2987.133 (64-bit)上截不到图，估计是图片异步加载的问题
        var dataUrl = this.viewer.getRenderBufferScreenShot(backgroundClr);
        dataUrl = this.editor.getScreenSnapshot(dataUrl);
        return dataUrl;
    },
    /**
     * 设置文字批注文本内容
     *
     * @param {string} text - 弹窗文本
     */
    setTextFromPopupBox: function (text) {
        if (this.editor) {
            this.editor.setTextFromPopupBox(text);
        }
    },
    /**
     * 取消文字批注文本内容设置
     *
     */
    unsetTextFromPopupBox: function () {
        if (this.editor) {
            this.editor.unsetTextFromPopupBox();
        }
    }
};