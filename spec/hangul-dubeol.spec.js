describe('hangul-dubeol.js', function () {

  var parameters = [
        ['', ''],
        ['gksrmfdl dks Tjwudy!', '한글이 안 써져요!'],
        ['dkswdk dlTwl dksgdmaus wjdtlsdmf dlfgdmf tneh dlTdjdy.',
         '앉아 있지 않으면 정신을 잃을 수도 있어요.'],
        ['10dnjf 7dlf dhgn 2tl rhkdhl', '10월 7일 오후 2시 과외'],
        ['rhkfqrnlswwlQkqdlswlrrtdddkzzzl', '괇귅지빱인직ㄳㅇㅇ앜ㅋ키'],
        ['RhkRRnswEnpsgdnprtkt lhkd kdl s', '꽊꾽뛚웩삿 ㅣㅘㅇ ㅏ이 ㄴ'],
        ['quf qkdqjqdms ek Tjqhkeh dksehldy nn wpqkf ehdhkwntpdy',
         '별 방법은 다 써봐도 안되요 ㅜㅜ 제발 도와주세요'],
        ['wltlrdlsdptj goqhfksmsrj ekgoeh dksTjwlrh',
         '지식인에서 해보라는거 다해도 안써지고']];

  describe('fromQuerty function', function () {
    it('should work as expected', function () {
      parameterize(parameters, function (input, output) {
        expect(hangul.dubeol.fromQwerty(input)).toEqual(output);
      });
    });

    it('should work as expected with backspaces', function () {
      parameterize(
        [['\b', ''],
         ['\b\b', ''],
         ['12345\b', '1234'],
         ['12345\b\b', '123'],
         ['dkssudgktpdy\b', '안녕하세ㅇ'],
         ['dkssudgktpdy\b\b', '안녕하세'],
         ['dkssudgktpdy\b\b\b', '안녕하'],
         ['dks\b', '아']],
        function (input, output) {
          expect(hangul.dubeol.fromQwerty(input)).toEqual(output);
        });
    });
  });

  describe('toQwerty function', function () {
    it('should work as expected', function () {
      parameterize(parameters, function (output, input) {
        expect(hangul.dubeol.toQwerty(input)).toEqual(output);
      });
    });
  });

});
