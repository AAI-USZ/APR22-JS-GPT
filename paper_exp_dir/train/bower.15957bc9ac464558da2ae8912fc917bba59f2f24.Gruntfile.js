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
reporter: 'spec',
timeout: '5000'
},
full: { src: ['test/test.js'] },
short: {
options: {
reporter: 'dot'
},
src: ['test/test.js']
}
},
exec: {
assets: {
command: 'node test/packages.js'
},
'assets-force': {
command: 'node test/packages.js --force'
},
cover: {
command: 'node node_modules/istanbul/lib/cli.js cover --dir ./test/reports node_modules/mocha/bin/_mocha -- -R dot test/test.js'
}
},
