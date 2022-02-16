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

$ npm run init
# or if you're on Windows
$ npm run init:windows

$ npm run build
`)
process.exit(1)
})

