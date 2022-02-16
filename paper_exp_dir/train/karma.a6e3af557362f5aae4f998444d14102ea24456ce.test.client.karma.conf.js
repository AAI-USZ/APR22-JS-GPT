var TRAVIS_WITHOUT_SAUCE = process.env.TRAVIS_SECURE_ENV_VARS === 'false'

var launchers = {
sl_chrome: {
base: 'SauceLabs',
browserName: 'chrome',
platform: 'Windows 7',
version: '47'
},
sl_firefox: {
base: 'SauceLabs',
browserName: 'firefox',
version: '43'
},
sl_safari: {
base: 'SauceLabs',
browserName: 'safari',
version: '9',
platform: 'OS X 10.11'
},
sl_ie_11: {
base: 'SauceLabs',
browserName: 'internet explorer',
platform: 'Windows 8.1',
version: '11'
},
sl_ie_10: {
base: 'SauceLabs',
browserName: 'internet explorer',
platform: 'Windows 7',
version: '10'
}
}

var browsers = []

if (process.env.TRAVIS) {
if (TRAVIS_WITHOUT_SAUCE) {
browsers.push('Firefox')
} else {
browsers = Object.keys(launchers)
}
} else {
browsers.push('Chrome')
}

module.exports = function (config) {
config.set({

basePath: '../..',

frameworks: ['browserify', 'mocha'],


files: [
'test/client/*.js'
],


exclude: [
],

preprocessors: {
'test/client/*.js': ['browserify']
},




reporters: ['progress', 'junit', 'saucelabs'],

junitReporter: {

outputFile: 'test-results.xml'
},



port: 9876,



colors: true,




logLevel: config.LOG_INFO,



autoWatch: true,










browsers: browsers,

customLaunchers: launchers,



captureTimeout: 50000,



singleRun: false,



reportSlowerThan: 500,

plugins: [
'karma-mocha',
'karma-chrome-launcher',
'karma-firefox-launcher',
'karma-junit-reporter',
'karma-browserify',
'karma-sauce-launcher'
]
})
}
