


module.exports = function(config) {
config.set({


basePath: '',

frameworks: ['jasmine'],


files: [
'*.js'
],




reporters: ['progress'],



port: 8080,



colors: true,




logLevel: config.LOG_INFO,



autoWatch: true,










browsers: [__dirname + '/fake-browser.sh'],




singleRun: false,

plugins: [
'karma-jasmine',
