/*!
 * hangul.js Dubeol @VERSION
 * http://github.com/clee704/hangul-js
 *
 * Copyright 2011, Choongmin Lee
 * Licensed under the MIT license.
 */
(function (hangul, undefined) {


var map = new hangul.Map();
map.addAll({
    'A': '\u3141', 'B': '\u3160', 'C': '\u314a', 'D': '\u3147', 'E': '\u3138',
    'F': '\u3139', 'G': '\u314e', 'H': '\u3157', 'I': '\u3151', 'J': '\u3153',
    'K': '\u314f', 'L': '\u3163', 'M': '\u3161', 'N': '\u315c', 'O': '\u3152',
    'P': '\u3156', 'Q': '\u3143', 'R': '\u3132', 'S': '\u3134', 'T': '\u3146',
    'U': '\u3155', 'V': '\u314d', 'W': '\u3149', 'X': '\u314c', 'Y': '\u315b',
    'Z': '\u314b'
});
// all the mappings in the inverse map is overwritten by the following call to
// addAll except for the five tense consonants, which are mapped by Q, W, E, R
// and T, repectively.
map.addAll({
    'a': '\u3141', 'b': '\u3160', 'c': '\u314a', 'd': '\u3147', 'e': '\u3137',
    'f': '\u3139', 'g': '\u314e', 'h': '\u3157', 'i': '\u3151', 'j': '\u3153',
    'k': '\u314f', 'l': '\u3163', 'm': '\u3161', 'n': '\u315c', 'o': '\u3150',
    'p': '\u3154', 'q': '\u3142', 'r': '\u3131', 's': '\u3134', 't': '\u3145',
    'u': '\u3155', 'v': '\u314d', 'w': '\u3148', 'x': '\u314c', 'y': '\u315b',
    'z': '\u314b'
});


function fromQwerty(text) {
    var buffer = [],
        m = new DubeolAutomaton(buffer),
        i;
    for (i = 0; i < text.length; i++) {
        m.next(text.charAt(i));
    }
    m.next();
    return buffer.join('');
}

function DubeolAutomaton(output) {
    this.output = output;
    this.currentBlock = undefined;
    this._prevJamo = undefined;
}

DubeolAutomaton.prototype.reset = function () {
    this.currentBlock = undefined;
    this._prevJamo = undefined;
};

DubeolAutomaton.prototype.next = function (key) {
    this.currentBlock = this._next(key);
};

DubeolAutomaton.prototype._next = function (currKey) {
    var buffer = this.output,
        block = this.currentBlock,
        currJamo = map.get(currKey),
        prevJamo = this._prevJamo,
        c,
        d,
        cc,
        jamo;
    this._prevJamo = currJamo;
    if (currKey === '\b') {
        c = undefined;
        if (block === undefined) {
            buffer.pop();
        } else if (hangul.isSyllable(block)) {
            jamo = hangul.decompose(block);
            if (jamo[2]) {
                c = hangul.compose(jamo[0], jamo[1]);
            } else {
                c = jamo[0];
            }
        }
        return c;
    }
    if (!map.hasKey(currKey)) {
        this._flush();
        if (currKey !== undefined)
            buffer.push(currKey);
        return undefined;
    }
    d = hangul.composeDoubleJamo(prevJamo, currJamo);
    if (map.hasValue(d)) {
        d = undefined;
    }
    if (d && !hangul.isSyllable(block)) {
        return d;
    }
    if (d) {
        jamo = hangul.decompose(block);
        jamo[hangul.isMedial(d) ? 1 : 2] = d;
        return hangul.compose.apply(hangul, jamo);
    }
    if (hangul.isFinal(currJamo)) {
        if (!hangul.isSyllable(block) || hangul.getFinal(block) !== '') {
            this._flush();
            return currJamo;
        }
        jamo = hangul.decompose(block);
        return hangul.compose(jamo[0], jamo[1], currJamo);
    }
    if (hangul.isInitial(currJamo)) {
        this._flush();
        return currJamo;
    }
    if (hangul.isInitial(block)) {
        return hangul.compose(block, currJamo, '');
    }
    if (!hangul.isSyllable(block) || !hangul.isInitial(prevJamo)) {
        this._flush();
        return currJamo;
    }
    jamo = hangul.decompose(block);
    if (hangul.isInitial(jamo[2])) {
        buffer.push(hangul.compose(jamo[0], jamo[1], ''));
        return hangul.compose(jamo[2], currJamo, '');
    }
    cc = hangul.decomposeDoubleJamo(jamo[2]);
    buffer.push(hangul.compose(jamo[0], jamo[1], cc[0]));
    return hangul.compose(cc[1], currJamo, '');
};

DubeolAutomaton.prototype._flush = function () {
    if (this.currentBlock !== undefined)
        this.output.push(this.currentBlock);
};


function toQwerty(text) {
    var buffer = [],
        i;
    for (i = 0; i < text.length; i++)
        _toQwerty(buffer, text.charAt(i));
    return buffer.join('');
}

function _toQwerty(buffer, currKey) {
    var cc,
        jamo,
        i,
        c;
    if (map.hasValue(currKey)) {
        buffer.push(map.inverse.get(currKey));
        return;
    }
    cc = hangul.decomposeDoubleJamo(currKey);
    if (cc) {
        buffer.push(map.inverse.get(cc[0]));
        buffer.push(map.inverse.get(cc[1]));
        return;
    }
    if (!hangul.isSyllable(currKey)) {
        buffer.push(currKey);
        return;
    }
    jamo = hangul.decompose(currKey);
    for (i = 0; i < jamo.length; i++) {
        c = jamo[i];
        if (map.hasValue(c)) {
            buffer.push(map.inverse.get(c));
            continue;
        }
        cc = hangul.decomposeDoubleJamo(c);
        buffer.push(map.inverse.get(cc[0]));
        buffer.push(map.inverse.get(cc[1]));
    }
}


var dubeol = {
    map: map,
    fromQwerty: fromQwerty,
    toQwerty: toQwerty,
    Automaton: DubeolAutomaton
};


hangul.dubeol = dubeol;


})(hangul);
