module.exports = function(karma) {
karma.configure({
frameworks: ['qunit'],

files: [
'lib/*.js',
'test/*.js'
],

autoWatch: true,

browsers: ['Chrome'],
