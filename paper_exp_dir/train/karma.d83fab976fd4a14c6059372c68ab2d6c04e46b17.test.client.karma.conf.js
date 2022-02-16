module.exports = function (config) {
config.set({

basePath: '../..',

frameworks: ['jasmine', 'commonjs'],


files: [
'client/*.js',
'test/client/*.js'
],


exclude: [
'client/main.js'
],

preprocessors: {
'client/*.js': ['commonjs'],
'test/client/*.js': ['commonjs']
},




reporters: ['progress', 'junit'],

junitReporter: {

outputFile: 'test-results.xml'
},



port: 9876,



colors: true,




logLevel: config.LOG_INFO,



autoWatch: true,










browsers: [process.env.TRAVIS ? 'Firefox' : 'Chrome'],



captureTimeout: 20000,



singleRun: false,



reportSlowerThan: 500,

plugins: [
'karma-jasmine',
'karma-chrome-launcher',
'karma-firefox-launcher',
'karma-junit-reporter',
'karma-commonjs'
]
})
}
