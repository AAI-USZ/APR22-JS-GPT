module.exports = function(grunt) {
require('load-grunt-tasks')(grunt);

grunt.initConfig({
jshint: {
options: {
jshintrc: '.jshintrc'
},
files: [
'Gruntfile.js',
