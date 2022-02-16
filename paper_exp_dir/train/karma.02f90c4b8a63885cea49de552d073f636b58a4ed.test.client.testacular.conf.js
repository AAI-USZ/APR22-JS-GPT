








basePath = '../..';


files = [
JASMINE,
JASMINE_ADAPTER,
'test/client/mocks.js',
'static/testacular.src.js',
'test/client/mocks/ObjectModel.js',
'adapter/*.src.js',
'test/client/*.spec.js'
];


exclude = [
'adapter/require.src.js'
];




reporters = ['progress', 'junit'];

junitReporter = {

outputFile: 'test-results.xml'
};



port = 9876;



runnerPort = 9100;



colors = true;




logLevel = LOG_INFO;



autoWatch = true;










browsers = [];



captureTimeout = 5000;



singleRun = false;



reportSlowerThan = 500;


preprocessors = {
'**/*.coffee': 'coffee'
};

plugins = [
'testacular-chrome-launcher',
'testacular-firefox-launcher',
