/*!
 * hangul.js Misc @VERSION
 * http://github.com/clee704/hangul-js
 *
 * Copyright 2011, Choongmin Lee
 * Licensed under the MIT license.
 */
(function (hangul, undefined) {


/**
 * Writes the specified hangul text in a full-width (全角) style.
 */
function applyFullWidthStyle(text) {
    var buffer = [];
    for (var i = 0; i < text.length; i++) {
        var c = text.charAt(i);
        if (c === ' ')
            continue;
        c = c === '\\' ? '\uffe6' : ('!' <= c && c <= '~')
            ? String.fromCharCode(c.charCodeAt(0) + 0xfee0) : c;
        buffer.push(c);
    }
    return buffer.join('');
}


/**
 * Writes the specified hangul text as if it is typed with the shift key
 * pressed all the time. {layout} can be {hangul.dubeol} or {hangul.sebeol}.
 */
function withShift(text, layout) {
    return _shift(text, layout);
}

/**
 * Writes the specified hangul text as if it is typed without using the shift
 * key. {layout} can be {hangul.dubeol} or {hangul.sebeol}.
 */
function withNoShift(text, layout) {
    return _shift(text, layout, true);
}

var qwertyShiftMap = new hangul.Map({
    'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D', 'e': 'E', 'f': 'F', 'g': 'G',
    'h': 'H', 'i': 'I', 'j': 'J', 'k': 'K', 'l': 'L', 'm': 'M', 'n': 'N',
    'o': 'O', 'p': 'P', 'q': 'Q', 'r': 'R', 's': 'S', 't': 'T', 'u': 'U',
    'v': 'V', 'w': 'W', 'x': 'X', 'y': 'Y', 'z': 'Z', '`': '~', '1': '!',
    '2': '@', '3': '#', '4': '$', '5': '%', '6': '^', '7': '&', '8': '*',
    '9': '(', '0': ')', '-': '_', '=': '+', '[': '{', ']': '}', '\\': '|',
    ';': ':', '\'': '"', ',': '<', '.': '>', '/': '?'
});

function _shift(text, layout, reverse) {
    var buffer = [];
    for (var i = 0; i < text.length; i++) {
        // dubeol examples:
        //   original - qwerty - qwerty (upper) - result
        //   ㅁ         a        A                ㅁ
        //   만         aks      AKS              만
        //   ab         ab       AB               AB
        // sebeol examples:
        //   간         kfs      KFS              2ㄻㄶ
        //   ㅃ         ;;       ::               44
        //   .          .        >                .
        //   <>         []       {}               %/
        var c = text.charAt(i);
        var q = layout.toQwerty(c);
        var x = c !== q || layout.map.hasValue(c)
            ? layout.fromQwerty(_upperStr(q, reverse)): _upper(c, reverse);
        buffer.push(x);
    }
    return buffer.join('');
}

function _upperStr(s, reverse) {
    var buffer = [];
    for (var i = 0; i < s.length; i++)
        buffer.push(_upper(s.charAt(i), reverse));
    return buffer.join('');
}

function _upper(c, reverse) {
    return !reverse ? qwertyShiftMap.get(c) || c
        : qwertyShiftMap.inverse.get(c) || c;
}


/**
 * Writes the specified hangul text in a serialized style (풀어쓰기).
 */
function serialize(text) {
    text = _decomposeAll(text, false);
    var buffer = [];
    for (var i = 0; i < text.length; i++) {
        var c0 = text.charAt(i);
        var c1 = text.charAt(i + 1);
        if (c0 === '\u3147' && hangul.isMedial(c1))
            continue;
        buffer.push(c0);
    }
    return buffer.join('');
}


function _decomposeAll(text, breakFinal) {
    var buffer = [];
    for (var i = 0; i < text.length; i++) {
        var c = text.charAt(i);
        if (!hangul.isSyllable(c)) {
            buffer.push(c);
            continue;
        }
        var jamo = hangul.decompose(c);
        buffer.push(jamo[0]);
        buffer.push(jamo[1]);
        if (!jamo[2])
            continue;
        var cc = hangul.decomposeDoubleJamo(jamo[2]);
        if (breakFinal && cc)
            buffer.push(cc[0], cc[1]);
        else
            buffer.push(jamo[2]);
    }
    return buffer.join('');
}


/**
 * Writes the specified hangul text in an initials-only style (초성체).
 */
function getInitials(text) {
    var buffer = [];
    for (var i = 0; i < text.length; i++) {
        var c = text.charAt(i);
        buffer.push(hangul.getInitial(c) || c);
    }
    return buffer.join('');
}


/**
 * Moves every initial of hangul syllables in the text to the final of the
 * previous syllable as long as the pronunciation is same (초성 올려 쓰기).
 * example: tugInitials('여기서 놉세') -> '역잇어 놊에'
 */
function tugInitials(text) {
    text = _decomposeAll(text, true);
    var buffer = [];
    for (var i = 0; i < text.length; i++) {
        var c0 = text.charAt(i);
        var c1 = text.charAt(i + 1);
        var c2 = text.charAt(i + 2);
        var c3 = text.charAt(i + 3);
        i = _tugInitials(buffer, text, i, c0, c1, c2, c3);
    }
    return buffer.join('');
}

function _tugInitials(buffer, text, i, c0, c1, c2, c3) {
    if (hangul.isMedial(c0) && hangul.getFinal(buffer.peek()))
        c3 = c2, c2 = c1, c1 = c0, c0 = '\u3147', i -= 1;
    if (!hangul.isInitial(c0) || !hangul.isMedial(c1))
        return buffer.push(c0), i;
    if (!hangul.isFinal(c2) || !_isOkToTug(c2, c3))
        return buffer.push(hangul.compose(c0, c1)), i += 1;
    var d = hangul.composeDoubleJamo(c2, c3);
    if (!hangul.isFinal(d) ||
            (hangul.isMedial(text.charAt(i + 4)) &&
             (c3 === '\u314e' || (c2 === c3 && (c2 === '\u3131' || c2 === '\u3145')))))
        return buffer.push(hangul.compose(c0, c1, c2)), i += 2;
    buffer.push(hangul.compose(c0, c1, d));
    return i += 3;
}

function _isOkToTug(c2, c3) {
    return !hangul.isMedial(c3) ||
        (!hangul.isIotizedVowel(c3) || c2 !== '\u3137' && c2 !== '\u314c') &&
         c2 !== '\u3147' && c2 !== '\u314e';
}


/**
 * Moves every final of hangul syllables in the text to the initial of the
 * next syllable as long as the pronunciation is same (종성 내려 쓰기).
 * example: nudgeFinals('남이섬에 가요') -> '나미서메 가요'
 */
function nudgeFinals(text) {
    var buffer = [];
    for (var i = 0; i < text.length; i++)
        buffer.push(text.charAt(i));
    for (var i = 0; i < buffer.length; i++) {
        var jamo0 = hangul.decompose(buffer[i]);
        var jamo1 = hangul.decompose(buffer[i + 1]);
        if (!jamo0 || !jamo1)
            continue;
        var fin = jamo0[2];
        if (!fin)
            continue;
        var ini = jamo1[0];
        var med = jamo1[1];
        if (_isOkToNudge(fin, ini, med)) {
            var cc = hangul.decomposeDoubleJamo(fin);
            if (cc && !hangul.isInitial(fin))
                buffer[i] = hangul.compose(jamo0[0], jamo0[1], cc[0]),
                buffer[i + 1] = hangul.compose(cc[1], med, jamo1[2]);
            else
                buffer[i] = hangul.compose(jamo0[0], jamo0[1]),
                buffer[i + 1] = hangul.compose(fin, med, jamo1[2]);
            continue;
        }
        var d = hangul.composeDoubleJamo(fin, ini);
        if (d && hangul.isInitial(d))
            buffer[i] = hangul.compose(jamo0[0], jamo0[1]),
            buffer[i + 1] = hangul.compose(d, med, jamo1[2]);
    }
    return buffer.join('');
}

function _isOkToNudge(fin, ini, med) {
    return fin !== '\u3147' && fin !== '\u314e' && fin !== '\u3136' &&
        fin !== '\u3140' && ini === '\u3147' &&
        (fin !== '\u3137' && fin !== '\u314c' || !hangul.isIotizedVowel(med));
}


var misc = {
    applyFullWidthStyle: applyFullWidthStyle,
    withShift: withShift,
    withNoShift: withNoShift,
    serialize: serialize,
    getInitials: getInitials,
    tugInitials: tugInitials,
    nudgeFinals: nudgeFinals
};


hangul.misc = misc;


})(hangul);
