const fs = require('fs')

const TRAVIS_WITH_BS = !!process.env.BROWSER_STACK_ACCESS_KEY

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


fs.lstat('node_modules/karma', (err, stats) => {
if (err) {
console.error('Cannot verify installation', err.stack || err)
}
if (stats && stats.isSymbolicLink()) {
return
}

console.log('**** Incorrect directory layout for karma self-tests ****')
console.log(`
$ npm install
$ rm -rf node_modules/karma
$ cd node_modules
$ ln -s ../ karma
$ cd ../
$ grunt browserify
`)
process.exit(1)
})

let browsers = []

if (process.env.TRAVIS) {
if (TRAVIS_WITH_BS) {
browsers = Object.keys(launchers)
} else {
browsers.push('Firefox')
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
project: 'Karma',



pollingTimeout: 10000
}
})
}
