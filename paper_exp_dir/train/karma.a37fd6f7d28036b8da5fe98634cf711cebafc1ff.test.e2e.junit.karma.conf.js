module.exports = function(karma) {
karma.configure({
frameworks: ['jasmine'],

files: [
'*.js'
],

autoWatch: true,

browsers: ['Chrome'],

reporters: ['dots', 'junit'],
