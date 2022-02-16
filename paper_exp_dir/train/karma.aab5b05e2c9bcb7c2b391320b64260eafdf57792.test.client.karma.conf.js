module.exports = function(config) {
config.set({

basePath: '../..',

frameworks: ['jasmine'],


files: [
'test/client/mocks.js',
'static/karma.src.js',
'test/client/*.spec.js'
],


exclude: [],




reporters: ['progress', 'junit'],

junitReporter: {

outputFile: 'test-results.xml'
},



port: 9876,



runnerPort: 9100,



colors: true,




logLevel: config.LOG_INFO,



autoWatch: true,










browsers: [process.env.TRAVIS ? 'Firefox' : 'Chrome'],



captureTimeout: 5000,



singleRun: false,



reportSlowerThan: 500,


preprocessors: {
'**/*.coffee': 'coffee'
},

plugins: [
'karma-jasmine',
'karma-chrome-launcher',
'karma-firefox-launcher',
'karma-junit-reporter'
]
});
};
