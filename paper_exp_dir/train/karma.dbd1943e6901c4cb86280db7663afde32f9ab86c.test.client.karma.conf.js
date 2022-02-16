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






bs_ie: {
base: 'BrowserStack',
browser: 'IE',
browser_version: '11.0',
os: 'Windows',
os_version: '10'
}
}


fs.lstat('node_modules/karma', (err, stats) => {
