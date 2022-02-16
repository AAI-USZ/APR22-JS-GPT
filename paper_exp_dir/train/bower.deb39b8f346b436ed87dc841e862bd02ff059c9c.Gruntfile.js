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
'!test/reports/**/*'
]
},
simplemocha: {
options: {
reporter: 'spec',
timeout: '5000'
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
command: 'STRICT_REQUIRE=1 node node_modules/istanbul/lib/cli.js cover --dir ./test/reports node_modules/mocha/bin/_mocha -- -R dot test/test.js'
},
coveralls: {
command: 'node node_modules/.bin/coveralls < test/reports/lcov.info'
}
},
watch: {
files: ['<%= jshint.files %>'],
tasks: ['jshint', 'simplemocha:short']
}
