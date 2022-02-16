module.exports = function(karma) {
karma.configure({
frameworks: ['ng-scenario'],

files: [
'e2eSpec.js'
],

urlRoot: '/__karma/',

autoWatch: true,

