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

if (npmMajor !== 3 || npmMinor < 5) {
grunt.log.writeln('You need to use at least npm@3.5 to publish bower.');
grunt.log.writeln('It is because npm 2.x produces too long paths that Windows does not handle.');
grunt.log.writeln('Please upgrade it: npm install -g npm');
process.exit(1);
}

var version = require('./package').version;
var changelog = fs.readFileSync('./CHANGELOG.md');

if (changelog.indexOf('## ' + version) === -1) {
grunt.log.writeln('Please add changelog.md entry for this bower version (' + version + ')');

var lastRelease = childProcess.execSync('git tag | tail -1').toString().trim();

grunt.log.writeln('Commits since last release (' + lastRelease + '): \n');

grunt.log.writeln(childProcess.execSync('git log --oneline ' + lastRelease + '..').toString());

process.exit(1);
}

if (childProcess.execSync('git rev-parse --abbrev-ref HEAD').toString().trim() !== 'master') {
grunt.log.writeln('You need to release bower from the "master" branch');

process.exit(1);
}

grunt.log.writeln('Reinstalling dependencies...');
childProcess.execSync('rm -rf node_modules && npm install', { stdio: [0, 1, 2] });

grunt.log.writeln('Running test suite...');
childProcess.execSync('grunt test', { stdio: [0, 1, 2] });

var dir = tmp.dirSync().name;
var pkgDir = path.resolve(dir, 'lib');

wrench.copyDirSyncRecursive(__dirname, pkgDir, {
forceDelete: true,
include: function (path) {
return !path.match(/node_modules|\.git|test/);
}
});

grunt.log.writeln('Installing dependencies');
childProcess.execSync('npm install --production --silent', { cwd: pkgDir, stdio: [0, 1, 2] });

fs.createReadStream(
path.resolve(__dirname, 'README.md')
).pipe(
fs.createWriteStream(path.resolve(dir, 'README.md'))
);

var json = require('./package');
delete json.dependencies;
delete json.devDependencies;
delete json.scripts;
delete json.files;

fs.writeFileSync(path.resolve(dir, 'package.json'), JSON.stringify(json, null, '  '));
fs.writeFileSync(path.resolve(dir, 'lib/index.js'), 'module.exports = require(\'./lib\');\n');
fs.mkdirSync(path.resolve(dir, 'bin'));
fs.writeFileSync(path.resolve(dir, 'bin/bower'), '#!/usr/bin/env node\nrequire(\'../lib/bin/bower\');\n');
fs.chmodSync(path.resolve(dir, 'bin/bower'), '0755');
