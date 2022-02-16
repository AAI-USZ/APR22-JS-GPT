'use strict';

var tmp = require('tmp');
var childProcess = require('child_process');
var arraydiff = require('arr-diff');
var fs = require('fs');
var wrench = require('wrench');
var inquirer = require('inquirer');
var path = require('path');

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
'!test/sample/**/*',
'!test/tmp/**/*'
]
},
jscs: {
options: {
config: '.jscsrc',
fix: true
},
files: ['<%= jshint.files %>']
},
simplemocha: {
options: {
reporter: 'spec',
timeout: '15000'
},
full: {
src: ['test/test.js']
},
