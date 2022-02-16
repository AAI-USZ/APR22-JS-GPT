'use strict';

var childProcess = require('child_process');
var arraydiff = require('arr-diff');
var fs = require('fs');
var inquirer = require('inquirer');

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
simplemocha: {
options: {
reporter: 'spec',
timeout: '15000'
},
full: {
src: ['test/test.js']
},
short: {
options: {
reporter: 'dot'
},
src: ['test/test.js']
}
},
exec: {
assets: {
command: 'node test/packages.js && node test/packages-svn.js'
},
'assets-force': {
command: 'node test/packages.js --force && node test/packages-svn.js --force'
},
cover: {
command: 'node node_modules/istanbul/lib/cli.js cover --dir ./test/reports node_modules/mocha/bin/_mocha -- --timeout 30000 -R dot test/test.js'
},
coveralls: {
command: 'npm run coveralls < test/reports/lcov.info',
exitCodes: [0,1,2,3]
}
},
watch: {
files: ['<%= jshint.files %>'],
tasks: ['jshint', 'simplemocha:short']
}
});

