// Converts between Dubeolsik and QWERTY.
// Author: Chungmin Lee (lemonedo@gmail.com)
// Date: 2010-07-21 00:26:58 +0900

if (!hangul)
    throw new Error('module "hangul" not found');


(function (hangul) {


// prevent redefining the "undefined"
var undefined = void(0);


var map = new hangul.Dict()
map.addAll({
    'A': '\u3141', 'B': '\u3160', 'C': '\u314a', 'D': '\u3147', 'E': '\u3138',
    'F': '\u3139', 'G': '\u314e', 'H': '\u3157', 'I': '\u3151', 'J': '\u3153',
    'K': '\u314f', 'L': '\u3163', 'M': '\u3161', 'N': '\u315c', 'O': '\u3152',
    'P': '\u3156', 'Q': '\u3143', 'R': '\u3132', 'S': '\u3134', 'T': '\u3146',
    'U': '\u3155', 'V': '\u314d', 'W': '\u3149', 'X': '\u314c', 'Y': '\u315b',
    'Z': '\u314b'
});
map.addAll({
    'a': '\u3141', 'b': '\u3160', 'c': '\u314a', 'd': '\u3147', 'e': '\u3137',
    'f': '\u3139', 'g': '\u314e', 'h': '\u3157', 'i': '\u3151', 'j': '\u3153',
    'k': '\u314f', 'l': '\u3163', 'm': '\u3161', 'n': '\u315c', 'o': '\u3150',
    'p': '\u3154', 'q': '\u3142', 'r': '\u3131', 's': '\u3134', 't': '\u3145',
    'u': '\u3155', 'v': '\u314d', 'w': '\u3148', 'x': '\u314c', 'y': '\u315b',
    'z': '\u314b'
});
// all of the mappings in the inverse map was replaced by the second addAll()
// except for the five tense consonants, which are mapped by Q, W, E, R and
// T, repectively.


function fromQwerty(text) {
    var buffer = [];
    var temp = '', prev, curr;
    for (var i = 0; i < text.length; i++) {
        curr = text.charAt(i);
        temp = _fromQwerty(buffer, temp, prev, curr);
        prev = curr;
    }
    buffer.push(temp);
    return buffer.join('');
}

function _fromQwerty(buffer, temp, prev, curr) {
    if (!map.hasKey(curr))
        return buffer.push(temp), curr;
    curr = map.get(curr);
    prev = map.get(prev);
    var d = hangul.composeDoubleJamo(prev, curr);
    if (map.hasValue(d))
        d = undefined;
    if (d && !hangul.isSyllable(temp))
        return d;
    if (d) {
        var jamo = hangul.decompose(temp);
        jamo[hangul.isMedial(d) ? 1 : 2] = d;
        return hangul.compose.apply(hangul, jamo);
    }
    if (hangul.isFinal(curr)) {
        if (!hangul.isSyllable(temp) || hangul.getFinal(temp) !== '')
            return buffer.push(temp), curr;
        var jamo = hangul.decompose(temp);
        return hangul.compose(jamo[0], jamo[1], curr);
    }
    if (hangul.isInitial(curr))
        return buffer.push(temp), curr;
    if (hangul.isInitial(temp))
        return hangul.compose(temp, curr, '');
    if (!hangul.isSyllable(temp) || !hangul.isInitial(prev))
        return buffer.push(temp), curr;
    var jamo = hangul.decompose(temp);
    if (hangul.isInitial(jamo[2])) {
        buffer.push(hangul.compose(jamo[0], jamo[1], ''));
        return hangul.compose(jamo[2], curr, '');
    }
    var cc = hangul.decomposeDoubleJamo(jamo[2]);
    buffer.push(hangul.compose(jamo[0], jamo[1], cc[0]));
    return hangul.compose(cc[1], curr, '');
}


function toQwerty(text) {
    var buffer = [];
    for (var i = 0; i < text.length; i++)
        _toQwerty(buffer, text.charAt(i));
    return buffer.join('');
}

function _toQwerty(buffer, curr) {
    if (map.hasValue(curr))
        return buffer.push(map.inverse.get(curr));
    var cc = hangul.decomposeDoubleJamo(curr);
    if (cc) {
        buffer.push(map.inverse.get(cc[0]));
        buffer.push(map.inverse.get(cc[1]));
        return;
    }
    if (!hangul.isSyllable(curr))
        return buffer.push(curr);
    var jamo = hangul.decompose(curr);
    for (var i = 0; i < jamo.length; i++) {
        var c = jamo[i];
        if (map.hasValue(c)) {
            buffer.push(map.inverse.get(c));
            continue;
        }
        cc = hangul.decomposeDoubleJamo(c);
        buffer.push(map.inverse.get(cc[0]));
        buffer.push(map.inverse.get(cc[1]));
    }
}


hangul.dubeol = {};
hangul.dubeol.map = map;
hangul.dubeol.fromQwerty = fromQwerty;
hangul.dubeol.toQwerty = toQwerty;


})(hangul);
