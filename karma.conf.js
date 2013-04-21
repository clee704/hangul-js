// Karma configuration
// Generated on Sun Apr 21 2013 18:35:23 GMT+0900 (KST)


// base path, that will be used to resolve files and exclude
basePath = '';


// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  'hangul.js',
  'hangul-misc.js',
  'hangul-dubeol.js',
  'hangul-sebeol.js',
  'spec/spec_helper.js',
  'spec/*.spec.js'
];


preprocessors = {
  // don't forget to prefix paths with **/
  '**/hangul.js': 'coverage',
  '**/hangul-*.js': 'coverage'
};


// list of files to exclude
exclude = [
  '*.conf.js'
];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress', 'growl', 'coverage'];


// web server port
port = 9876;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome', 'Firefox', 'Safari'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 60000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;


// Coverage
coverageReporter = {
  type: 'html',
  dir: 'coverage/'
};
