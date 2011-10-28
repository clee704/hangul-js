/*!
 * hangul.js Sebeol @VERSION
 * http://github.com/clee704/hangul-js
 *
 * Copyright 2011, Choongmin Lee
 * Licensed under the MIT license.
 */
(function (hangul, undefined) {


var Wrap = (function () {
    var cache = {};
    return function (type, c)  {
        var entry = cache[type] || (cache[type] = {});
        return entry[c] || (entry[c] = new Character(type, c));
    }
})();

function Character(type, c) {
    this.type = type;
    this.c = c;
    this.code = c.charCodeAt(0);
    this.string = type + '[' + c + ']';
}

Character.prototype.toString = function () {
    return this.string;
}

var map = new hangul.Map();
// deliberatly avoided overlapping keys or values
map.addAll({
    '\'': initial('\u314c'), '0': initial('\u314b'), ';': initial('\u3142'),
    'h': initial('\u3134'), 'i': initial('\u3141'), 'j': initial('\u3147'),
    'k': initial('\u3131'), 'l': initial('\u3148'), 'm': initial('\u314e'),
    'n': initial('\u3145'), 'o': initial('\u314a'), 'p': initial('\u314d'),
    'u': initial('\u3137'), 'y': initial('\u3139'), '4': medial('\u315b'),
    '5': medial('\u3160'), '6': medial('\u3151'), '7': medial('\u3156'),
    '8': medial('\u3162'), 'G': medial('\u3152'), 'b': medial('\u315c'),
    'c': medial('\u3154'), 'd': medial('\u3163'), 'e': medial('\u3155'),
    'f': medial('\u314f'), 'g': medial('\u3161'), 'r': medial('\u3150'),
    't': medial('\u3153'), 'v': medial('\u3157'), '/': medialSp('\u3157'),
    '9': medialSp('\u315c'), '!': final_('\u3132'), '#': final_('\u3148'),
    '$': final_('\u313f'), '%': final_('\u313e'), '1': final_('\u314e'),
    '2': final_('\u3146'), '3': final_('\u3142'), '@': final_('\u313a'),
    'A': final_('\u3137'), 'C': final_('\u314b'), 'D': final_('\u313c'),
    'E': final_('\u3135'), 'F': final_('\u313b'), 'Q': final_('\u314d'),
    'R': final_('\u3140'), 'S': final_('\u3136'), 'T': final_('\u313d'),
    'V': final_('\u3133'), 'W': final_('\u314c'), 'X': final_('\u3144'),
    'Z': final_('\u314a'), 'a': final_('\u3147'), 'q': final_('\u3145'),
    's': final_('\u3134'), 'w': final_('\u3139'), 'x': final_('\u3131'),
    'z': final_('\u3141'), '"': symbol('\u00b7'), '&': symbol('\u201c'),
    '(': symbol('\''), ')': symbol('~'), '*': symbol('\u201d'),
    '+': symbol('+'), ',': symbol(','), '-': symbol(')'),
    '.': symbol('.'), ':': symbol('4'), '<': extra(','),
    '=': symbol('>'), '>': extra('.'), '?': symbol('!'),
    'B': symbol('?'), 'H': symbol('0'), 'I': symbol('7'),
    'J': symbol('1'), 'K': symbol('2'), 'L': symbol('3'),
    'M': symbol('"'), 'N': symbol('-'), 'O': symbol('8'),
    'P': symbol('9'), 'U': symbol('6'), 'Y': symbol('5'),
    '[': symbol('('), '\\': symbol(':'), ']': symbol('<'),
    '^': symbol('='), '_': symbol(';'), '`': symbol('*'),
    '{': symbol('%'), '|': symbol('\\'), '}': symbol('/'),
    '~': symbol('\u203b')
});

function initial(c) {
    return Wrap('initial', c);
}

function medial(c) {
    return Wrap('medial', c);
}

// denotes a medial that may make a compound vowel
// (there are two such characters, which are mapped by / and 9 repectively)
function medialSp(c) {
    return Wrap('medial-special', c);
}

function final_(c) {
    return Wrap('final', c);
}

function symbol(c) {
    return Wrap('symbol', c);
}

// to avoid collisions with other symbols when searching inverse
function extra(c) {
    return Wrap('extra', c);
}


/**
 * Converts the specified text typed in QWERTY to a text that the same
 * keystrokes which made the text would have produced if the input method is
 * Sebeolsik Final. It assumes the specified text is typed with CapsLock off.
 * If the text contains characters that cannot be typed in QWERTY, they are
 * preserved.
 */
function fromQwerty(text) {
    var buffer = [];
    var block = [undefined, undefined, undefined];
    var prevJamo = [];
    var currKey;
    for (var i = 0; i < text.length; i++) {
        currKey = text.charAt(i);
        _fromQwerty(buffer, block, prevJamo, currKey);
    }
    _flush(buffer, block, prevJamo);
    return buffer.join('');
}

var index = {'initial': 0, 'medial': 1, 'medial-special': 1, 'final': 2};
var wrapper = {'initial': initial, 'medial': medial, 'final': final_};

function _fromQwerty(buffer, block, prevJamo, currKey) {
    if (!map.hasKey(currKey))
        return _flush(buffer, block, prevJamo), buffer.push(currKey);
    var currJamo = map.get(currKey);
    if (!hangul.isJamo(currJamo.c))
        return _flush(buffer, block, prevJamo), buffer.push(currJamo.c);
    var i = index[currJamo.type];
    var x = block[i];
    if (x)
        var d = hangul.composeDoubleJamo(x.c, currJamo.c);
    if (d && (x.type === 'initial' && !block[1] && !block[2] &&
            hangul.isInitial(d) || x.type === 'medial-special')) {
        delete prevJamo[prevJamo.indexOf(x)];
        return prevJamo.push(block[i] = wrapper[currJamo.type](d));
    }
    if (x)
        _flush(buffer, block, prevJamo);
    prevJamo.push(block[i] = currJamo);
}

function _flush(buffer, block, prevJamo) {
    block[2] = block[2] || '';
    if (block[0] && block[1])
        buffer.push(hangul.compose(block[0].c, block[1].c, block[2].c));
    else
        _push(buffer, prevJamo);
    block.length = 0;
    prevJamo.length = 0;
}

function _push(buffer, chars) {
    for (var i = 0; i < chars.length; i++)
        if (i in chars)
            buffer.push(chars[i].c);
}


function toQwerty(text) {
    var buffer = [];
    for (var i = 0; i < text.length; i++)
        _toQwerty(buffer, text.charAt(i));
    return buffer.join('');
}

function _toQwerty(buffer, currKey) {
    if (hangul.isJamo(currKey))
        return _putJamo(buffer, currKey, _getWrapper(currKey));
    if (!hangul.isSyllable(currKey))
        return buffer.push(map.inverse.get(symbol(currKey)) || currKey);
    var jamo = hangul.decompose(currKey);
    _putJamo(buffer, jamo[0], initial);
    _putJamo(buffer, jamo[1], medial);
    if (jamo[2])
        _putJamo(buffer, jamo[2], final_);
}

function _getWrapper(c) {
    // if the character is a consonant and can be either an initial or a
    // final, it is not possible to determine whether it is typed as an
    // intial or a final; here assumes it is an initial
    return hangul.isInitial(c) ? initial :
        hangul.isMedial(c) ? medial : final_;
}

function _putJamo(buffer, c, wrap) {
    var x = wrap(c);
    if (map.hasValue(x))
        return buffer.push(map.inverse.get(x));
    var cc = hangul.decomposeDoubleJamo(c);
    var wrap2 = wrap === medial ? medialSp : initial;
    buffer.push(map.inverse.get(wrap2(cc[0])));
    buffer.push(map.inverse.get(wrap(cc[1])));
}


function _flatten(map) {
    var buckets = {};
    for (var k in map.items) {
        var v = map.get(k);
        var bucket = buckets[v.type] || (buckets[v.type] = {});
        bucket[k] = v.c;
    }
    var flatMap = new hangul.Map();
    flatMap.addAll(buckets['extra']);
    flatMap.addAll(buckets['symbol']);
    flatMap.addAll(buckets['final']);
    flatMap.addAll(buckets['medial-special']);
    flatMap.addAll(buckets['medial']);
    flatMap.addAll(buckets['initial']);
    return flatMap;
}


var sebeol = {
    map: _flatten(map),
    fromQwerty: fromQwerty,
    toQwerty: toQwerty
};


hangul.sebeol = sebeol;


})(hangul);
