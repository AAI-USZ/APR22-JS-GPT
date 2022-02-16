module.exports = function(karma) {
karma.configure({
frameworks: ['jasmine'],

files: [
'*.coffee'
],

autoWatch: true,

browsers: ['Chrome'],

