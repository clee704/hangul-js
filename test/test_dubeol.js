eval(loadFile('src/hangul.js'));
eval(loadFile('src/hangul.dubeol.js'));


var data = new hangul.Map({
    '': '',
    'gksrmfdl dks Tjwudy!': '한글이 안 써져요!',
    'dkswdk dlTwl dksgdmaus wjdtlsdmf dlfgdmf tneh dlTdjdy.':
        '앉아 있지 않으면 정신을 잃을 수도 있어요.',
    '10dnjf 7dlf dhgn 2tl rhkdhl': '10월 7일 오후 2시 과외',
    'rhkfqrnlswwlQkqdlswlrrtdddkzzzl': '괇귅지빱인직ㄳㅇㅇ앜ㅋ키',
    'RhkRRnswEnpsgdnprtkt lhkd kdl s': '꽊꾽뛚웩삿 ㅣㅘㅇ ㅏ이 ㄴ',
    'quf qkdqjqdms ek Tjqhkeh dksehldy nn wpqkf ehdhkwntpdy':
        '별 방법은 다 써봐도 안되요 ㅜㅜ 제발 도와주세요',
    'wltlrdlsdptj goqhfksmsrj ekgoeh dksTjwlrh':
        '지식인에서 해보라는거 다해도 안써지고'
});


testCases(test,

function test_fromQwerty() {
    for (var text in data.items)
        assert.that(hangul.dubeol.fromQwerty(text), eq(data.get(text)));
},

function test_toQwerty() {
    for (var text in data.inverse.items)
        assert.that(hangul.dubeol.toQwerty(text), eq(data.inverse.get(text)));
}

);
