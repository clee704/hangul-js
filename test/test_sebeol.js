eval(loadFile('src/hangul.js'));
eval(loadFile('src/hangul.sebeol.js'));


function _test_fromQwerty(original, result) {
    assert.that(hangul.sebeol.fromQwerty(original), eq(result));
}

function _test_toQwerty(original, result) {
    assert.that(hangul.sebeol.toQwerty(original), eq(result));
}


testCases(test,

function test_fromQwerty_simple() {
    _test_fromQwerty('', '');
    _test_fromQwerty('jfsheamfncj4B', '안녕하세요?');
    _test_fromQwerty(' ltandsjd ;;tslltx? ;;/fD', ' 정신이 뻔쩍! 뽧');
    _test_fromQwerty('uu9dCkeshdubxkhjd;/dnn/xuu9', '뜈견니둑ㄱㄴ이뵈쏙뚜');
    _test_fromQwerty('~ kvaj9ts hr o9dnf &kgzld*', '※ 공원 내 취사 “금지”');
    _test_fromQwerty('ibsjtkf lbxjt2ngzufNN_', '문어가 죽었슴다--;');
},

function test_fromQwerty_details() {
    _test_fromQwerty('jdlbaivjgzjgs ltantxuryv [kkvrx, kk/rx-',
        '이중모음은 정석대로 (꼬ㅐ, 꽥)');
    _test_fromQwerty(';fAodz pbwjtnngkdhgs jfs u/dz [jfs1, jfS-',
        '받침 풀어쓰기는 안 됨 (안ㅎ, 않)');
    _test_fromQwerty('sbntnkf f;kk9djtvu clurvy nntlzd',
        '순서가 바뀌어도 제대로 써짐');
    _test_fromQwerty('ufs lba"lvanta jd2jgies ovnta kewmf3 ;bwkf [fkk, zkkf-',
        '단 중·종성 있으면 초성 결합 불가 (가ㄱ, ㄱ가)');
    _test_fromQwerty('jdlbaivjgzjgs ;famr;fAld jfSjgz [k/zf, 9uzd-',
        '이중모음은 방해받지 않음 (괌, 뒴)');
},

function test_toQwerty() {
    _test_toQwerty('', '');
    _test_toQwerty('안녕하세요?', 'jfsheamfncj4B');
    _test_toQwerty('반갑습니다.', ';fskf3ng3hduf.');
    _test_toQwerty('뛰뛰빵빵', 'uu9duu9d;;fa;;fa');
    _test_toQwerty('※ 공원 내 취사 “금지”', '~ kvaj9ts hr o9dnf &kgzld*');
    _test_toQwerty('예를 들면 꿍디꿍디', 'j7ygw ugwies kkbaudkkbaud');
    _test_toQwerty('뽧뀞쀓퀁쮥뙲', ';;/fDkk9dX;;9cR09tEll9d@uu/d$');
}

);
