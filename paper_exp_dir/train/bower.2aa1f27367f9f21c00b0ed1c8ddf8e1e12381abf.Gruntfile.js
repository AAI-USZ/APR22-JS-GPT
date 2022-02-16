var tmp = require('tmp');
var childProcess = require('child_process');
var arraydiff = require('arr-diff');
var fs = require('fs');
var wrench = require('wrench');
var inquirer = require('inquirer');
var path = require('path');

module.exports = function(grunt) {
require('load-grunt-tasks')(grunt);

grunt.initConfig({
eslint: {
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
command:
'node test/packages.js --force && node test/packages-svn.js --force'
},
cover: {
command:
'node node_modules/istanbul/lib/cli.js cover --dir ./test/reports node_modules/mocha/bin/_mocha -- --timeout 30000 -R dot test/test.js'
},
coveralls: {
command: 'npm run coveralls < test/reports/lcov.info',
exitCodes: [0, 1, 2, 3]
}
},
watch: {
files: ['<%= eslint.files %>'],
tasks: ['eslint', 'simplemocha:short']
}
});

grunt.registerTask('assets', ['exec:assets-force']);
grunt.registerTask('test', ['eslint', 'exec:assets', 'simplemocha:full']);
grunt.registerTask('cover', 'exec:cover');
grunt.registerTask('travis', [
'eslint',
'exec:assets',
'exec:cover',
'exec:coveralls'
]);
grunt.registerTask('default', 'test');

grunt.task.registerTask(
'publish',
'Perform final checks and publish Bower',
function() {
var jsonPackage = require('./package');

if (
childProcess
.execSync('git rev-parse --abbrev-ref HEAD')
.toString()
.trim() !== 'master'
) {
grunt.log.writeln(
'You need to release bower from the "master" branch'
