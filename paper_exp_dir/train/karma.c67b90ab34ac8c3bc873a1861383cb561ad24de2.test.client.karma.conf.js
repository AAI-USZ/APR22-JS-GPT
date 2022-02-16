const TRAVIS_WITHOUT_BS = process.env.TRAVIS_SECURE_ENV_VARS === 'false'

const launchers = {
bs_chrome: {
base: 'BrowserStack',
browser: 'chrome',
os: 'Windows',
os_version: '10'
},
bs_firefox: {
base: 'BrowserStack',
browser: 'firefox',
os: 'Windows',
os_version: '10'
},
bs_safari: {
base: 'BrowserStack',
browser: 'safari',
browser_version: '9.0',
os_version: 'El Capitan',
os: 'OS X'
},
bs_ie_11: {
base: 'BrowserStack',
browser: 'ie',
browser_version: '11.0',
os: 'Windows',
os_version: '10'
},
bs_ie_10: {
base: 'BrowserStack',
browser: 'ie',
browser_version: '10.0',
os: 'Windows',
os_version: '8'
},
bs_ie_9: {
base: 'BrowserStack',
browser: 'ie',
browser_version: '9.0',
os: 'Windows',
os_version: '7'
}
















}

let browsers = []

if (process.env.TRAVIS) {
if (TRAVIS_WITHOUT_BS) {
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




reporters: ['progress', 'junit'],

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
'karma-browserstack-launcher'
],

concurrency: 3,

forceJSONP: true,

browserStack: {
project: 'Karma'
}
})
}
