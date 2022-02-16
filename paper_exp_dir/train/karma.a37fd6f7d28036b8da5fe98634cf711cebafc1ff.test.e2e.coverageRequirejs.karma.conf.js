module.exports = function(karma) {
karma.configure({
frameworks: ['mocha', 'requirejs'],

files: [
'main.js',
{pattern: '*.js', included: false},
],

autoWatch: true,
