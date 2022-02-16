const fs = require('fs')

var TRAVIS_WITHOUT_BS = process.env.TRAVIS_SECURE_ENV_VARS === 'false'

var launchers = {
bs_chrome: {
base: 'BrowserStack',
browser: 'chrome',
os: 'Windows',
os_version: '10'
},
