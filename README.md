hangul.js
=========
[![Build Status](https://secure.travis-ci.org/clee704/hangul-js.png?branch=master)](http://travis-ci.org/clee704/hangul-js)

hangul.js is a simple JavaScript library that provides functions to manipulate
Hangul text. Each function is capable of a specific task, such as:

* to check if a character is a Hangul syllabic block (such as "가")
* to compose/decompose a Hangul syllabic block from/into jamo
* to convert between different input methods (e.g. Dubeol and QWERTY)

Project documentation: <http://clee704.github.io/hangul-js/>

Development Tools
-----------------
You can `make init` to install all required tools.

### Karma

    npm install -g karma

[Karma](http://karma-runner.github.io/) is used to run tests. Run `make test`
for a single run of tests and `make karma` to watch code and run tests again
when code is changed.

### UglifyJS 2

    npm install -g uglify-js

[UglifyJS 2](https://github.com/mishoo/UglifyJS2) is used to generate minified
code. Run `make` or `make min` to generate minified code. Note that minified
code is tracked for easy access, so make sure to generate them before commit.

### JSDoc 3

    npm install -g git://github.com/jsdoc3/jsdoc.git

[JSDoc 3](https://github.com/jsdoc3/jsdoc) is used to generate documentation.
