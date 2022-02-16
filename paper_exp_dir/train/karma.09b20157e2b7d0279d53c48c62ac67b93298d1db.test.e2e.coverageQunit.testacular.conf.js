frameworks = ['qunit'];

files = [
'lib/*.js',
'test/*.js'
];

exclude = [
'testacular.conf.js'
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
'testacular-qunit',
'testacular-coverage',
'testacular-chrome-launcher',
'testacular-firefox-launcher'
