describe('hangul.js', function () {

  describe('Compatibility', function () {

    describe('Array indexOf method', function () {
      it('should work', function () {
        var a = [];
        expect(Boolean(a.indexOf)).toBe(true);
        expect(a.indexOf('q')).toEqual(-1);
        for (var i = 0; i < 100; i++) a.push(i * i);
        for (var i = 0; i < a.length; i++) {
          expect(a.indexOf(a[i])).toEqual(i);
        }
        delete a[34];
        expect(a.indexOf(34 * 34)).toEqual(-1);
      });
    });
  });

  describe('Set', function () {
    var set;

    beforeEach(function () {
      set = new hangul.Set('foo', 42, false, 'bar');
    });

    describe('has method', function () {
      it('should return true if the set contains the specified item', function () {
        expect(set.has('foo')).toBe(true);
        expect(set.has('bar')).toBe(true);
        expect(set.has(false)).toBe(true);
        expect(set.has(42)).toBe(true);
      });

      it("should return false if the set doesn't contain the specified item", function () {
        expect(set.has('Foo')).toBe(false);
        expect(set.has('')).toBe(false);
        expect(set.has(0)).toBe(false);
        expect(set.has(undefined)).toBe(false);
        expect(set.has(null)).toBe(false);
      });
    });

    describe('add method', function () {
      it ('should add the specified item into the set', function () {
        set.add('FOO');
        expect(set.has('FOO')).toBe(true);
        set.add(0);
        expect(set.has(0)).toBe(true);
      });
    });
  });

  describe('Map', function () {
    var map;

    beforeEach(function () {
      map = new hangul.Map({'A': 'Alfa', 'B': 'Bravo', 'C': 'Charlie'});
    });

    describe('add method', function () {
      it('should add the specified mapping to the map', function () {
        map.add('D', 'Delta');
        expect(map.hasKey('D')).toBe(true);
        expect(map.hasValue('Delta')).toBe(true);
      });
    });

    describe('addAll method', function () {
      it('should add the specified mappings to the map', function () {
        map.addAll({'T': 'Tango', 'U': 'Uniform'});
        expect(map.hasKey('T')).toBe(true);
        expect(map.hasKey('U')).toBe(true);
        expect(map.hasValue('Tango')).toBe(true);
        expect(map.hasValue('Uniform')).toBe(true);
      });
    });

    describe('hasKey method', function () {
      it('should return true if the map contains the specified key', function () {
        expect(map.hasKey('A')).toBe(true);
        expect(map.hasKey('B')).toBe(true);
        expect(map.hasKey('C')).toBe(true);
      });

      it("should return false if the map doesn't contain the specified key", function () {
        expect(map.hasKey('a')).toBe(false);
        expect(map.hasKey('D')).toBe(false);
        expect(map.hasKey('T')).toBe(false);
        expect(map.hasKey('U')).toBe(false);
        expect(map.hasKey('')).toBe(false);
      });
    });

    describe('hasValue method', function () {
      it('should return true if the map contains the specified value', function () {
        expect(map.hasValue('Alfa')).toBe(true);
        expect(map.hasValue('Bravo')).toBe(true);
        expect(map.hasValue('Charlie')).toBe(true);
      });

      it("should return false if the map doesn't contain the specified value", function () {
        expect(map.hasValue('alfa')).toBe(false);
        expect(map.hasValue('Delta')).toBe(false);
        expect(map.hasValue('')).toBe(false);
      });
    });
  });

  var jamo = [
        'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ',
        'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ', 'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ',
        'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ',
        'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ', 'ㄳ', 'ㄵ', 'ㄶ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ',
        'ㅀ', 'ㅄ'
      ],
      initials = [
        'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ',
        'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
      ],
      medials = [
        'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ',
        'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'
      ],
      finals = [
        'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ',
        'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ', 'ㄳ', 'ㄵ', 'ㄶ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ',
        'ㅀ', 'ㅄ'
      ];

  describe('jamo', function () {
    it('should include all modern hangul jamo', function () {
      for (var i = 0; i < jamo.length; ++i) {
        expect(hangul.jamo.hasValue(jamo[i])).toBe(true);
        expect(hangul.isJamo(jamo[i])).toBe(true);
      }
    });

    describe('initials', function () {
      it('should include all modern hangul initials', function () {
        for (var i = 0; i < initials.length; ++i) {
          expect(hangul.initials.hasValue(initials[i])).toBe(true);
          expect(hangul.isInitial(initials[i])).toBe(true);
        }
      });
    });

    describe('medials', function () {
      it('should include all modern hangul medials', function () {
        for (var i = 0; i < medials.length; ++i) {
          expect(hangul.medials.hasValue(medials[i])).toBe(true);
          expect(hangul.isMedial(medials[i])).toBe(true);
        }
      });
    });

    describe('finals', function () {
      it('should include all modern hangul finals', function () {
        for (var i = 0; i < finals.length; ++i) {
          expect(hangul.finals.hasValue(finals[i])).toBe(true);
          expect(hangul.isFinal(finals[i])).toBe(true);
        }
      });
    });
  });

  describe('isHangul function', function () {
    it('should return true for all modern hangul jamo', function () {
      for (var i = 0; i < jamo.length; ++i) {
        expect(hangul.isHangul(jamo[i])).toBe(true);
      }
    });

    it('should return true for hangul syllables', function () {
      expect(hangul.isHangul('가')).toBe(true);
      expect(hangul.isHangul('힣')).toBe(true);
      expect(hangul.isHangul('눝')).toBe(true);
    });

    it('should return false for anything else', function () {
      expect(hangul.isHangul('a')).toBe(false);
      expect(hangul.isHangul('0')).toBe(false);
      expect(hangul.isHangul('')).toBe(false);
      // Hangul Jamo (U+1100-U+11FF) is not supported
      expect(hangul.isHangul('ᄀ')).toBe(false);
    });
  });

  describe('isSyllable function', function () {
    it('should return false for all modern hangul jamo', function () {
      for (var i = 0; i < jamo.length; ++i) {
        expect(hangul.isSyllable(jamo[i])).toBe(false);
      }
    });

    it('should return true for hangul syllables', function () {
      expect(hangul.isSyllable('가')).toBe(true);
      expect(hangul.isSyllable('힣')).toBe(true);
      expect(hangul.isSyllable('눝')).toBe(true);
    });

    it('should return false for anything else', function () {
      expect(hangul.isSyllable('a')).toBe(false);
      expect(hangul.isSyllable('')).toBe(false);
    });
  });

  describe('getInitial function', function () {
    it('should return undefined if the specified character is not a hangul syllable', function () {
      expect(hangul.getInitial('a')).toBeUndefined();
      expect(hangul.getInitial('ㄱ')).toBeUndefined();
    });

    it('should return the initial jamo', function () {
      expect(hangul.getInitial('가')).toEqual('ㄱ');
      expect(hangul.getInitial('눝')).toEqual('ㄴ');
      expect(hangul.getInitial('쀊')).toEqual('ㅃ');
    });
  });

  describe('getMedial function', function () {
    it('should return undefined if the specified character is not a hangul syllable', function () {
      expect(hangul.getMedial('a')).toBeUndefined();
      expect(hangul.getMedial('ㄱ')).toBeUndefined();
    });

    it('should return the medial jamo', function () {
      expect(hangul.getMedial('가')).toEqual('ㅏ');
      expect(hangul.getMedial('눝')).toEqual('ㅜ');
      expect(hangul.getMedial('쀊')).toEqual('ㅞ');
    });
  });

  describe('getFinal function', function () {
    it('should return undefined if the specified character is not a hangul syllable', function () {
      expect(hangul.getFinal('a')).toBeUndefined();
      expect(hangul.getFinal('ㄱ')).toBeUndefined();
    });

    it('should return the final jamo', function () {
      expect(hangul.getFinal('가')).toEqual('');
      expect(hangul.getFinal('눝')).toEqual('ㅌ');
      expect(hangul.getFinal('쀊')).toEqual('ㄶ');
    });
  });

  describe('decompose function', function () {
    it('should return undefined if the specified character is not a hangul syllable', function () {
      expect(hangul.decompose('a')).toBeUndefined();
      expect(hangul.decompose('ㄱ')).toBeUndefined();
    });

    it('should return a list of decomposed jamo', function () {
      expect(hangul.decompose('가')).toEqual(['ㄱ', 'ㅏ']);
      expect(hangul.decompose('눝')).toEqual(['ㄴ', 'ㅜ', 'ㅌ']);
      expect(hangul.decompose('쀊')).toEqual(['ㅃ', 'ㅞ', 'ㄶ']);
    });
  });

  describe('compose function', function () {
    it('should return undefined if the specified characters cannot be composed to form a hangul syllable', function () {
      expect(hangul.compose('a', 'ㅏ')).toBeUndefined();
      expect(hangul.compose('ㄱ', 'ㅏ', 'ㄸ')).toBeUndefined();
      expect(hangul.compose('ㄶ', 'ㅏ')).toBeUndefined();
    });

    it('should return a composed hangul syllable', function () {
      expect(hangul.compose('ㄱ', 'ㅏ')).toEqual('가');
      expect(hangul.compose('ㄴ', 'ㅜ', 'ㅌ')).toEqual('눝');
      expect(hangul.compose('ㅃ', 'ㅞ', 'ㄶ')).toEqual('쀊');
    });
  });

  describe('composeDoubleJamo function', function () {
    it('should return undefined if the specified characters cannot be composed to form a double jamo', function () {
      expect(hangul.composeDoubleJamo('a', 'a')).toBeUndefined();
      expect(hangul.composeDoubleJamo('ㄴ', 'ㄴ')).toBeUndefined();
    });

    it('should return a composed double consotant', function () {
      expect(hangul.composeDoubleJamo('ㄷ', 'ㄷ')).toEqual('ㄸ');
      expect(hangul.composeDoubleJamo('ㄱ', 'ㅅ')).toEqual('ㄳ');
    });

    it('should return a composed double vowel', function () {
      expect(hangul.composeDoubleJamo('ㅜ', 'ㅓ')).toEqual('ㅝ');
      expect(hangul.composeDoubleJamo('ㅡ', 'ㅣ')).toEqual('ㅢ');
      expect(hangul.composeDoubleJamo('ㅗ', 'ㅐ')).toEqual('ㅙ');
    });
  });

  describe('decomposeDoubleJamo function', function () {
    it('should return undefined if the specified character is not a double jamo', function () {
      expect(hangul.decomposeDoubleJamo('a')).toBeUndefined();
      expect(hangul.decomposeDoubleJamo('ㄴ')).toBeUndefined();
      expect(hangul.decomposeDoubleJamo('똾')).toBeUndefined();
      expect(hangul.decomposeDoubleJamo('ㅖ')).toBeUndefined();
    });

    it('should return an list of decomposed double consonant', function () {
      expect(hangul.decomposeDoubleJamo('ㅃ')).toEqual(['ㅂ', 'ㅂ']);
      expect(hangul.decomposeDoubleJamo('ㄻ')).toEqual(['ㄹ', 'ㅁ']);
    });

    it('should return a list of decomposed double vowels', function () {
      expect(hangul.decomposeDoubleJamo('ㅢ')).toEqual(['ㅡ', 'ㅣ']);
      expect(hangul.decomposeDoubleJamo('ㅞ')).toEqual(['ㅜ', 'ㅔ']);
    });
  });

  describe('iotizedVowels', function () {
    var iotizedVowels = ['ㅑ', 'ㅒ', 'ㅕ', 'ㅖ', 'ㅛ', 'ㅠ', 'ㅣ'];

    it('should include all modern iotized vowels', function () {
      for (var i = 0; i < iotizedVowels.length; ++i) {
        expect(hangul.isIotizedVowel(iotizedVowels[i])).toBe(true);
      }
    });
  });
});
