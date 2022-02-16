frameworks = ['jasmine'];


files = [
'*.js'
];

autoWatch = true;
autoWatchInterval = 1;
logLevel = LOG_INFO;
logColors = true;

browsers = ['Chrome'];

reporters = ['dots'];

plugins = [
'karma-jasmine',
'karma-chrome-launcher',
'karma-firefox-launcher'
];
