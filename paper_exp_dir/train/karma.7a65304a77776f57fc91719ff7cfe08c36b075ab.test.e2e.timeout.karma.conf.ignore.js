




basePath = '';

frameworks = ['jasmine'];


files = [
'*.js'
];



exclude = [];




reporters = ['progress'];



port = 8080;



runnerPort = 9100;



colors = true;




logLevel = LOG_INFO;



autoWatch = true;










browsers = [__dirname + '/fake-browser.sh'];

captureTimeout = 1000;




singleRun = false;

plugins = [
'karma-jasmine',
'karma-chrome-launcher',
'karma-firefox-launcher'
];
