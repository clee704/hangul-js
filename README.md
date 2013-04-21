hangul.js
=========
hangul.js is a simple JavaScript library that provides functions to manipulate
Hangul text. Each function is capable of a specific task, such as:

* to check if a character is a Hangul syllabic block (such as "가")
* to compose/decompose a Hangul syllabic block from/into jamo
* to convert between different input methods (e.g. Dubeol and QWERTY)

Development
-----------
Install [Karma](http://karma-runner.github.io/) to run tests:

    npm install -g karma

Then `make test` for a single run of tests and `make karma` to watch code and
run tests again when code is changed.

Install [UglifyJS 2](https://github.com/mishoo/UglifyJS2) to generate minified
code:

    npm install -g uglify-js

Then `make` or `make min` to generate minified code. Note that minified code is
tracked for easy access, so make sure to generate them before commit.

You can `make init` to install all required tools.
