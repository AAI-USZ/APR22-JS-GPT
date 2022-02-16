frameworks = ['qunit'];

files = [
'lib/*.js',
'test/*.js'
];

exclude = [
'karma.conf.js'
];

autoWatch = true;

browsers = ['Chrome'];

reporters = ['progress', 'coverage'];

preprocessors = {
'**/coverage/lib/*.js': 'coverage'
};








coverageReporter = {

type : 'html',
dir : 'coverage/'
};

plugins = [
'karma-qunit',
'karma-coverage',
'karma-chrome-launcher',
'karma-firefox-launcher'
];
