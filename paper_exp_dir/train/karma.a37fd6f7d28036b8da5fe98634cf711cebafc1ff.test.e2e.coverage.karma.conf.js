module.exports = function(karma) {
karma.configure({
frameworks: ['jasmine'],

files: [
'lib/*.js',
'test/*.js'
],

autoWatch: true,

browsers: ['Chrome'],
