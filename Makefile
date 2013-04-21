sources = hangul.js hangul-misc.js hangul-dubeol.js hangul-sebeol.js
minified = $(sources:.js=.min.js)

min: $(minified)

$(minified): %.min.js: %.js
	uglifyjs $< -o $@ -m --comments --lint

test:
	karma start --single-run

karma:
	karma start

clean:
	rm -rf coverage

init:
	npm install -g karma
	npm install -g uglify-js
	npm install -g git://github.com/jsdoc3/jsdoc.git

docs:
	jsdoc -d docs $(sources) README.md

.PHONY: min test karma clean init docs
