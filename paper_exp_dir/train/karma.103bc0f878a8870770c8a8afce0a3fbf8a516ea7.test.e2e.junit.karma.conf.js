frameworks = ['jasmine'];

files = [
'*.js'
];

autoWatch = true;

browsers = ['Chrome']

reporters = ['dots', 'junit'];

logLevel = LOG_DEBUG;

junitReporter = {
outputFile: 'test-results.xml'
};

plugins = [
'karma-jasmine',
