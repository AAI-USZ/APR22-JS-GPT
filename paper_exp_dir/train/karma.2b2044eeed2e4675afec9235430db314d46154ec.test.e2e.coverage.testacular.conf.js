frameworks = ['jasmine'];

files = [
'lib/*.js',
'test/*.js'
];

exclude = [
'karma.conf.js'
];

autoWatch = true;

browsers = ['Chrome']

reporters = ['progress', 'coverage'];

preprocessors = {
'**/coverage/lib/*.js': 'coverage'
};








coverageReporter = {

type : 'html',
dir : 'coverage/'
};

plugins = [
'testacular-jasmine',
'testacular-coverage',
'testacular-chrome-launcher',
'testacular-firefox-launcher'
];
