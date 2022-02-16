var TRAVIS_WITHOUT_SAUCE = process.env.TRAVIS_SECURE_ENV_VARS === 'false'

var launchers = {
sl_chrome: {
base: 'SauceLabs',
browserName: 'chrome',
platform: 'Windows 7',
version: '47'
},
sl_firefox: {
