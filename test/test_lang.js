eval(loadFile('src/lang.js'));


testCases(test,

function test_Array_indexOf() {
    var a = [];
    assert.that(Boolean(a.indexOf), isTrue());
    assert.that(a.indexOf('q'), eq(-1));
    for (var i = 0; i < 100; i++)
        a.push(i * i);
    for (var i = 0; i < a.length; i++)
        assert.that(a.indexOf(a[i]), eq(i));
    delete a[34];
    assert.that(a.indexOf(34 * 34), eq(-1));
}

);
