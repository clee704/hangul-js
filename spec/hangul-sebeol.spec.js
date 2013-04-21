describe('hangul-sebeol.js', function () {

  describe('fromQwerty function', function () {
    it('should work as expected', function () {
      parameterize(
        [['', ''],
         ['jfsheamfncj4B', '안녕하세요?'],
         [' ltandsjd ;;tslltx? ;;/fD', ' 정신이 뻔쩍! 뽧'],
         ['uu9dCkeshdubxkhjd;/dnn/xuu9', '뜈견니둑ㄱㄴ이뵈쏙뚜'],
         ['~ kvaj9ts hr o9dnf &kgzld*', '※ 공원 내 취사 “금지”'],
         ['ibsjtkf lbxjt2ngzufNN_', '문어가 죽었슴다--;']],
        function (input, output) {
          expect(hangul.sebeol.fromQwerty(input)).toEqual(output);
        });
    });

    it('should work as specified', function () {
      parameterize(
        [['jdlbaivjgzjgs ltantxuryv [kkvrx, kk/rx-',
          '이중모음은 정석대로 (꼬ㅐ, 꽥)'],
         [';fAodz pbwjtnngkdhgs jfs u/dz [jfs1, jfS-',
          '받침 풀어쓰기는 안 됨 (안ㅎ, 않)'],
         ['sbntnkf f;kk9djtvu clurvy nntlzd', '순서가 바뀌어도 제대로 써짐'],
         ['ufs lba"lvanta jd2jgies ovnta kewmf3 ;bwkf [fkk, zkkf-',
          '단 중·종성 있으면 초성 결합 불가 (가ㄱ, ㄱ가)'],
         ['jdlbaivjgzjgs ;famr;fAld jfSjgz [k/zf, 9uzd-',
          '이중모음은 방해받지 않음 (괌, 뒴)']],
        function (input, output) {
          expect(hangul.sebeol.fromQwerty(input)).toEqual(output);
        });
    });

    it('should work as expected with backspaces', function () {
      parameterize(
        [['\b', ''],
         ['\b\b', ''],
         ['1234\b', 'ㅎㅆㅂ'],
         ['12345\b', 'ㅎㅆㅛ'],
         ['12345\b\b', 'ㅎㅆ'],
         ['jfsheamfncj4\b', '안녕하세ㅇ'],
         ['jfsheamfncj4\b\b', '안녕하세'],
         ['jfsheamfncj4\b\b\b', '안녕하'],
         ['jfsheamfnc4j\b', '안녕하세ㅛ']],
        function (input, output) {
          expect(hangul.sebeol.fromQwerty(input)).toEqual(output);
        });
    });
  });

  describe('toQwerty function', function () {
    it('should work as expected', function () {
      parameterize(
        [['', ''],
         ['안녕하세요?', 'jfsheamfncj4B'],
         ['반갑습니다.', ';fskf3ng3hduf.'],
         ['뛰뛰빵빵', 'uu9duu9d;;fa;;fa'],
         ['※ 공원 내 취사 “금지”', '~ kvaj9ts hr o9dnf &kgzld*'],
         ['예를 들면 꿍디꿍디', 'j7ygw ugwies kkbaudkkbaud'],
         ['뽧뀞쀓퀁쮥뙲', ';;/fDkk9dX;;9cR09tEll9d@uu/d$'],
         ['ㄲㄲㄲ ㅣㅣㅣ ㅄㅄㅄ', 'kkkkkk ddd XXX']],
        function (input, output) {
          expect(hangul.sebeol.toQwerty(input)).toEqual(output);
        });
    });
  });
});
