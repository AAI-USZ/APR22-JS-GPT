files = [
JASMINE,
JASMINE_ADAPTER,
'lib/*.js',
'test/*.js'
];

exclude = [
'testacular.conf.js'
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
