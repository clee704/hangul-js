eval(loadFile('src/hangul.js'));
eval(loadFile('src/hangul.dubeol.js'));
eval(loadFile('src/hangul.sebeol.js'));
eval(loadFile('src/hangul.misc.js'));


function makeAssertEqFunc(func) {
    return function (input, output) {
        assert.that(func(input), eq(output));
    };
}


testCases(test,

function test_applyFullWidthStyle() {
    var test = makeAssertEqFunc(hangul.misc.applyFullWidthStyle);
    test('한글은 한국어의 고유 문자로서, 1443년 조선 제4대 임금 세종이 훈민정음(訓民正音)이라는 이름으로 창제하여 1446년에 반포하였다.',
        '한글은한국어의고유문자로서，１４４３년조선제４대임금세종이훈민정음（訓民正音）이라는이름으로창제하여１４４６년에반포하였다．');
    test('가격 \\100', '가격￦１００');
},

function test_withShift_dubeol() {
    var test = makeAssertEqFunc(function (text) {
        return hangul.misc.withShift(text, hangul.dubeol);
    });
    test('안녕하세요? 반갑습니다.', '안녕하쎼요? 빤까ㅃ쓰ㅃ니따>');
    test('쉬프트 키가 빠지지 않아요.', '쒸프트 키까 빠찌찌 않아요>');
    test('계속 이런 상태면 어떡하죠?', '꼐쏚 이런 쌍턔면 어떢하쬬?');
    test('abcdefg 다음에 계속', 'ABCDEFG 따음예 꼐쏚');
    test('쉬프트 같은 걸 끼얹나?', '쒸프트 깥은 껄 끼언ㅉ나?');
},

function test_withNoShift_dubeol() {
    var test = makeAssertEqFunc(function (text) {
        return hangul.misc.withNoShift(text, hangul.dubeol);
    });
    test('쌍시옷 받침 있음', '상시옷 받침 잇음');
    test('예삿일, 똥, 얘기', '에삿일, 동, 애기');
    test('쿼티 기호: !@#$%^&*()~_+{}:"<>? ...',
        '쿼티 기호; 1234567890`-=[];\',./ ...');
},

function test_withShift_sebeol() {
    var test = makeAssertEqFunc(function (text) {
        return hangul.misc.withShift(text, hangul.sebeol);
    });
    test('안녕하세요? 반갑습니다. 안녕히가세요.',
        '1ㄻㄶ0ㄵㄷ"ㄻ-ㅋ1ㄿ? 4ㄻㄶ2ㄻㅈ-ㅒㅈ0ㄼ6ㄻ. 1ㄻㄶ0ㄵㄷ"ㄼ2ㄻ-ㅋ1ㄿ.');
    test('쉬프트 키가 빠지지 않아요.',
        '-\'ㄼ9ㅒ·ㅒ ~ㄼ2ㄻ 44ㄻ3ㄼ3ㄼ 1ㄻㄶ1ㄻ1ㄿ.');
    test('계속 이런 상태면 어떡하죠?',
        '2“-ㄳㅄ 1ㄼ5ㄽㄶ -ㄻㄷ·ㅀ7ㄵㄶ 1ㄽ66ㄽㅄ"ㄻ3ㄿ?');
    test('abcdefg 다음에 계속', 'ABCDEFG 6ㄻ1ㅒㅊ1ㅋ 2“-ㄳㅄ');
    test('세벌식에서 쉬프트키가 빠지지 않으면...',
        '-ㅋ4ㄽㅌ-ㄼㅄ1ㅋ-ㄽ -\'ㄼ9ㅒ·ㅒ~ㄼ2ㄻ 44ㄻ3ㄼ3ㄼ 1ㄻㄶ1ㅒ7ㄵㄶ...');
    test('*)>(<,.', '※;+%/,.');
},

function test_withNoShift_sebeol() {
    var test = makeAssertEqFunc(function (text) {
        return hangul.misc.withNoShift(text, hangul.sebeol);
    });
    test('쌍시옷 받침 있음', '쌍시옷 방침 있음');
    test('예삿일, 똥, 얘기', '예삿일, 똥, 으기');
    test('쉬프트가 안 눌리는 것은 큰일이 아니군요!',
        '쉬프트가 안 눌리는 것은 큰일이 아니군요ㅗ');
},

function test_serialize() {
    var test = makeAssertEqFunc(hangul.misc.serialize);
    test('안녕하세요? 반갑습니다.',
        'ㅏㄴㄴㅕㅇㅎㅏㅅㅔㅛ? ㅂㅏㄴㄱㅏㅂㅅㅡㅂㄴㅣㄷㅏ.');
    test('이과인 뚝배기 떫어',
        'ㅣㄱㅘㅣㄴ ㄸㅜㄱㅂㅐㄱㅣ ㄸㅓㄼㅓ');
},

function test_getInitials() {
    var test = makeAssertEqFunc(hangul.misc.getInitials);
    test('초성체 테스트 ㅋㅋ', 'ㅊㅅㅊ ㅌㅅㅌ ㅋㅋ');
    test('뚝배기는 장맛', 'ㄸㅂㄱㄴ ㅈㅁ');
    test('장 같은 걸 끼얹나?', 'ㅈ ㄱㅇ ㄱ ㄲㅇㄴ?');
    test('넌 나에게 모욕감을 줬어', 'ㄴ ㄴㅇㄱ ㅁㅇㄱㅇ ㅈㅇ');
},

function test_tugInitials() {
    var test = makeAssertEqFunc(hangul.misc.tugInitials);
    test('초성올려쓰기', '촛엉올렸윽이');
    test('여기서 놉세.', '역잇어 놊에.');
    test('디티이히댜탸뎌텨됴툐듀튜드티', '디티이히댜탸뎌텨됴툐듀튣으티');
    test('기지개를 펴고 앉아', '깆익앨을 펵오 앉아');
    test('네가 그런 엄숙한 얼굴을 할 줄은 몰랐다',
        '넥아 글언 엄숙한 얽울을 할 줄은 몰랐다');
    test('학교 샷시', '학교 샷시');
},

function test_nudgeFinals() {
    var test = makeAssertEqFunc(hangul.misc.nudgeFinals);
    test('종성내려쓰기', '종성내려쓰기');
    test('남이섬에 가요.', '나미서메 가요.');
    test('동남아 여행객에게 필요한 것은?', '동나마 여행개게게 피료한 거슨?');
    test('난안안안안안안앉아', '나나나나나나나난자');
}

);
