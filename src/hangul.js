// Core functions for hangul text processing.
// Author: Chungmin Lee (lemonedo@gmail.com)

if (!lang)
    throw new Error('module "lang" not found');


var hangul = new function () {


// prevent redefining the "undefined"
var undefined = void(0);


/**
 * Constructs a simple set containing the specified arguments.
 */
function Set() {
    this.items = {};
    for (var i = 0; i < arguments.length; i++)
        this.add(arguments[i]);
}

Set.prototype.has = function (e) {
    return e in this.items;
}

Set.prototype.add = function (e) {
    this.items[e] = 1;
}


/**
 * Constructs a simple dictionary, supporting an inverse view, optionally
 * containing properties of the specified object as entries if it is present. 
 */
function Dict(o, _inverse) {
    this.items = {};
    this.inverse = _inverse || new Dict(undefined, this);
    if (o)
        this.addAll(o);
}

Dict.prototype.add = function (k, v) {
    this.items[k] = v;
    this.inverse.items[v] = k;
}

Dict.prototype.addAll = function (o) {
    for (var k in o)
        this.add(k, o[k]);
}

Dict.prototype.hasKey = function (k) {
    return k in this.items;
}

Dict.prototype.hasValue = function (v) {
    return v in this.inverse.items;
}

Dict.prototype.get = function (k) {
    return this.items[k];
}


/** List of modern hangul jamo (U+3131-U+3163). */
var jamo = collectJamo(0x3131, 0x3163);

/**
 * List of modern hangul initial jamo. Actually some of these charaters are
 * not just initials, but can also be final jamo. Thus many characters in this
 * list overlap with the characters in {finals}.
 */
var initials = collectJamo(0x3131, 0x314e,
    [2, 4, 5, 9, 10, 11, 12, 13, 14, 15, 19]);

/** List of modern hangul medials. */
var medials = collectJamo(0x314f, 0x3163);

/**
 * List of modern hangul finals. The details are the same as {initials}.
 * The list does not include a filler.
 */
var finals = collectJamo(0x3131, 0x314e, [7, 18, 24]);

function collectJamo(from, to, exclude) {
    var dict = new Dict();
    var length = to - from + 1;
    for (var i = 0, j = 0; i < length; i++)
        if (!exclude || exclude.indexOf(i) < 0)
            dict.add(j++, String.fromCharCode(i + from));
    return dict;
}


/**
 * Returns true if the first character of the specified string represents
 * modern hangul characters (U+3131-U+3163 and U+AC00-U+D7A3; no support for
 * the "Hangul Jamo", "Hangul Jamo Extended-A", "Hangul Jamo Extended-B"
 * blocks).
 */
function isHangul(s) {
    var c = s && s.charAt && s.charAt(0);
    return jamo.hasValue(c) || isSyllable(c);
}

/**
 * Returns true if the first character of the specified string represents
 * modern hangul syllables (U+AC00-U+D7A3).
 */
function isSyllable(s) {
    var code = s && s.charCodeAt && s.charCodeAt(0);
    return 0xac00 <= code && code <= 0xd7a3;
}

/**
 * Returns true if the first character of the specified string represents
 * modern jamo (U+3131-U+3163).
 */
function isJamo(s) {
    return jamo.hasValue(s && s.charAt && s.charAt(0));
}

/**
 * Returns true if the first character of the specified string represents
 * modern hangul initials.
 */
function isInitial(s) {
    return initials.hasValue(s && s.charAt && s.charAt(0));
}

/**
 * Returns true if the first character of the specified string represents
 * modern hangul medials.
 */
function isMedial(s) {
    return medials.hasValue(s && s.charAt && s.charAt(0));
}

/**
 * Returns true if the first character of the specified string represents
 * modern hangul finals.
 */
function isFinal(s) {
    return finals.hasValue(s && s.charAt && s.charAt(0));
}


/**
 * Returns the initial of the first chacater of the specified string.
 * Returns undefined if the character is not a hangul syllable.
 */
function getInitial(s) {
    var code = s && s.charCodeAt && s.charCodeAt(0);
    return initials.get(Math.floor((code - 0xac00) / 28 / 21));
}

/**
 * Returns the medial of the first chacater of the specified string.
 * Returns undefined if the character is not a hangul syllable.
 */
function getMedial(s) {
    var code = s && s.charCodeAt && s.charCodeAt(0);
    return medials.get(Math.floor((code - 0xac00) / 28) % 21);
}

/**
 * Returns the final of the first chacater of the specified string, or
 * an empty string '' if the syllable has no final jamo. Returns undefined
 * if the character is not a hangul syllable.
 */
function getFinal(s) {
    var code = s && s.charCodeAt && s.charCodeAt(0);
    var i = (code - 0xac00) % 28;
    return i > 0 ? finals.get(i - 1) : i === 0 ? '' : undefined;
}


/**
 * Decomposes the first character of the specified string into constituent
 * jamo and returns them as an array of length 3 (or 2 if there is no final).
 * They are obtained using {intial()}, {medial()} and {final_()}. Returns
 * undefined if the character is not a hangul syllable.
 */
function decompose(s) {
    var c = s && s.charAt && s.charAt(0);
    if (!isSyllable(c))
        return undefined;
    var jamo = [getInitial(c), getMedial(c), getFinal(c)];
    if (jamo[2] === '')
        jamo.pop();
    return jamo;
}

/**
 * Composes from the specified constituent jamo a hangul syllable. Use
 * undefined or an empty string '' for the final filler. Returns undefined if
 * any of the arguments are not a modern jamo, except for the final which can
 * also be either undefined or an empty string.
 */
function compose(ini, med, fin) {
    var x = initials.inverse.get(ini);
    var y = medials.inverse.get(med);
    var z = fin === undefined || fin === '' ? 0 : finals.inverse.get(fin) + 1;
    var c = String.fromCharCode(0xac00 + (x * 21 + y) * 28 + z);
    return isSyllable(c) ? c : undefined;
}


/**
 * List of modern hangul double jamo (clusters and compounds).
 */
var doubleJamo = new Dict({
    '\u3133': '\u3131\u3145', '\u3135': '\u3134\u3148',
    '\u3136': '\u3134\u314e', '\u313a': '\u3139\u3131',
    '\u313b': '\u3139\u3141', '\u313c': '\u3139\u3142',
    '\u313d': '\u3139\u3145', '\u313e': '\u3139\u314c',
    '\u313f': '\u3139\u314d', '\u3140': '\u3139\u314e',
    '\u3144': '\u3142\u3145', '\u3132': '\u3131\u3131',
    '\u3138': '\u3137\u3137', '\u3143': '\u3142\u3142',
    '\u3146': '\u3145\u3145', '\u3149': '\u3148\u3148',
    '\u3158': '\u3157\u314f', '\u3159': '\u3157\u3150',
    '\u315a': '\u3157\u3163', '\u315d': '\u315c\u3153',
    '\u315e': '\u315c\u3154', '\u315f': '\u315c\u3163',
    '\u3162': '\u3161\u3163'
});

/**
 * Composes from the specified jamo a double jamo. Returns undefined if
 * the specified jamo do not make a double jamo.
 */
function composeDoubleJamo(c1, c2) {
    return doubleJamo.inverse.get(c1 + c2);
}

/**
 * Decomposes the specified double jamo into two jamo and returns them as an
 * array of length 2. Returns undefined if the specified jamo is not a double
 * jamo.
 */
function decomposeDoubleJamo(c) {
    var cc = doubleJamo.get(c);
    return cc === undefined ? cc : [cc.charAt(0), cc.charAt(1)];
}


var iotizedVowels = new Set('\u3163', '\u3151', '\u3152', '\u3155', '\u3156',
    '\u315b', '\u3160');

/**
 * Returns true if the first character of the specified string represents
 * a iotized vowel (including the close front vowel) that may cause
 * palatalization.
 */
function isIotizedVowel(s) {
    return iotizedVowels.has(s && s.charAt && s.charAt(0));
}


this.Set = Set;
this.Dict = Dict;

this.jamo = jamo;
this.initials = initials;
this.medials = medials;
this.finals = finals;

this.isHangul = isHangul;
this.isSyllable = isSyllable;
this.isJamo = isJamo;
this.isInitial = isInitial;
this.isMedial = isMedial;
this.isFinal = isFinal;

this.getInitial = getInitial;
this.getMedial = getMedial;
this.getFinal = getFinal;

this.decompose = decompose;
this.compose = compose;

this.composeDoubleJamo = composeDoubleJamo;
this.decomposeDoubleJamo = decomposeDoubleJamo;

this.isIotizedVowel = isIotizedVowel;


}
