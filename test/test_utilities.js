eval(loadFile('src/lang.js'));
eval(loadFile('src/hangul.js'));


testCases(test,

function simple_usage_of_set() {
    var set = new hangul.Set('Alfa', 'Bravo', 'Charlie', 'Delta', 'Echo');
    assert.that(set.has('Alfa'), isTrue());
    assert.that(set.has('Bravo'), isTrue());
    assert.that(set.has('charlie'), isFalse());
},

function simple_usage_of_dict() {
    var dict = new hangul.Dict({
        'A': 'Alfa', 'B': 'Bravo', 'C': 'Charlie', 'D': 'Delta', 'E': 'Echo',
        'F': 'Foxtrot', 'G': 'Golf', 'H': 'Hotel', 'I': 'India',
        'J': 'Juliett', 'K': 'Kilo', 'L': 'Lima', 'M': 'Mike', 'N': 'November',
        'O': 'Oscar', 'P': 'Papa', 'Q': 'Quebec', 'R': 'Romeo', 'S': 'Sierra',
        'T': 'Tango', 'U': 'Uniform', 'V': 'Victor', 'W': 'Whiskey',
        'X': 'X-ray', 'Y': 'Yankee', 'Z': 'Zulu'
    });
    assert.that(dict.get('R'), eq('Romeo'));
    assert.that(dict.get('J'), eq('Juliett'));
    assert.that(dict.hasKey('Z'), isTrue());
    assert.that(dict.inverse.get('Foxtrot'), eq('F'));
    assert.that(dict.inverse.get('Zulu'), eq('Z'));
    assert.that(dict.inverse.hasValue('Romeo'), isFalse());
    assert.that(dict.get('Victor'), eq(undefined));
}

);
