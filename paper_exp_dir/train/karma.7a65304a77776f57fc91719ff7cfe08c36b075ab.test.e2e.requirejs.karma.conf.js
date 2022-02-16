




basePath = '';

frameworks = ['jasmine', 'requirejs'];


files = [
'main.js',


{pattern: '*.js', included: false}
];



exclude = [
'karma.conf.js'
];




reporter = 'dots';



port = 9876;



runnerPort = 9100;



colors = true;




logLevel = LOG_INFO;



autoWatch = true;









browsers = ['Chrome'];




singleRun = false;

plugins = [
'karma-requirejs',
'karma-jasmine',
'karma-chrome-launcher',
'karma-firefox-launcher'
];
