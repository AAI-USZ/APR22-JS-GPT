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
reporter: 'spec'
},
full: { src: ['test/test.js'] },
short: {
options: {
reporter: 'dot'
},
src: ['test/test.js']
}
},
execute: {
assets: {
src: ['test/assets/downloader.js']
}
},
watch: {
files: ['<%= jshint.files %>'],
tasks: ['jshint', 'simplemocha:short']
},
shell: {
cover: {
command: 'node node_modules/istanbul/lib/cli.js cover --dir ./test/reports node_modules/mocha/bin/_mocha -- -R dot',
options: {
stdout: true,
stderr: true
}
}
}
