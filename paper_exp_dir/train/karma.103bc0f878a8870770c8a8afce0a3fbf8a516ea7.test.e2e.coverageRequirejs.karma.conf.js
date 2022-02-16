frameworks = ['mocha', 'requirejs'];

files = [
'main.js',
{pattern: '*.js', included: false},
];

autoWatch = true;
browsers = ['Chrome'];
singleRun = false;

reporters = ['progress', 'coverage'];

preprocessors = {
'**/coverageRequirejs/dependency.js': 'coverage'
};

coverageReporter = {
type : 'html',
