module.exports = function(karma) {
karma.configure({
frameworks: ['mocha'],

files: [
'*.js'
],

autoWatch: true,
browsers: ['Chrome'],
