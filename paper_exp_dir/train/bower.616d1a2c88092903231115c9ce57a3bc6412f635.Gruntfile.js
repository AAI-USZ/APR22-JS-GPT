module.exports = function (grunt) {
grunt.initConfig({
jshint: {
options: {
jshintrc: '.jshintrc'
},
files: ['Gruntfile.js', 'bin/*', 'lib/**/*.js', 'test/**/*.js', '!test/assets/**/*']
},
simplemocha: {
options: {
reporter: 'spec'
},
full: { src: ['test/test.js'] },
short: {
