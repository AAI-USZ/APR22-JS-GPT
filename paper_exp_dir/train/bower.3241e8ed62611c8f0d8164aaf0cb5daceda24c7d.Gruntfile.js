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

grunt.registerTask('assets', ['exec:assets-force']);
grunt.registerTask('test', ['jscs', 'jshint', 'exec:assets', 'simplemocha:full']);
grunt.registerTask('cover', 'exec:cover');
grunt.registerTask('travis', ['jshint', 'exec:assets', 'exec:cover', 'exec:coveralls']);
grunt.registerTask('default', 'test');

grunt.task.registerTask('publish', 'Perform final checks and publish Bower', function () {
var npmVersion = JSON.parse(childProcess.execSync('npm version --json').toString()).npm.split('.');
var npmMajor = parseInt(npmVersion[0], 10);
var npmMinor = parseInt(npmVersion[1], 10);

var jsonPackage = require('./package');

if (npmMajor !== 3 || npmMinor < 5) {
grunt.log.writeln('You need to use at least npm@3.5 to publish bower.');
grunt.log.writeln('It is because npm 2.x produces too long paths that Windows does not handle.');
grunt.log.writeln('Please upgrade it: npm install -g npm');
process.exit(1);
}

var version = jsonPackage.version;
