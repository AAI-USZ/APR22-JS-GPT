var TRAVIS_WITHOUT_SAUCE = process.env.TRAVIS_SECURE_ENV_VARS === 'false';

module.exports = function(config) {
config.set({
frameworks: ['jasmine'],

files: [
'*.js'
],

autoWatch: true,
