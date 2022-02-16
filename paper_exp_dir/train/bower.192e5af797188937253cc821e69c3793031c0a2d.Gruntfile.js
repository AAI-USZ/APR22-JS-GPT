'use strict';
module.exports = function (grunt) {
require('load-grunt-tasks')(grunt);

grunt.initConfig({
jshint: {
options: {
jshintrc: '.jshintrc'
},
files: [
'Gruntfile.js',
'bin/*',
'lib/**/*.js',
'test/**/*.js',
'!test/assets/**/*',
'!test/reports/**/*',
'!test/tmp/**/*'
]
},
simplemocha: {
options: {
reporter: 'spec',
timeout: '5000'
},
full: {
