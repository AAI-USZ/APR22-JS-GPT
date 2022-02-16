module.exports = function(grunt) {
require('load-grunt-tasks')(grunt);

grunt.initConfig({
jshint: {
files: [
'Gruntfile.js',
'lib/**/*.js',
'test/**/*.js',
'!test/reports/**/*'
