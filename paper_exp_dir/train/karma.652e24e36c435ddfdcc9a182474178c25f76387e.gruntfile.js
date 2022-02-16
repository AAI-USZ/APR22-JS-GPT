module.exports = function (grunt) {
grunt.initConfig({
pkg: grunt.file.readJSON('package.json'),
pkgFile: 'package.json',
files: {
server: ['lib/**/*.js'],
client: ['client/**/*.js'],
common: ['common/**/*.js'],
context: ['context/**/*.js'],
grunt: ['grunt.js', 'tasks/*.js'],
scripts: ['scripts/init-dev-env.js']
},
browserify: {
client: {
files: {
'static/karma.js': ['client/main.js'],
'static/context.js': ['context/main.js']
}
}
},
test: {
unit: 'mochaTest:unit',
client: 'test/client/karma.conf.js'
},
watch: {
client: {
files: '<%= files.client %>',
tasks: 'browserify:client'
}
},
mochaTest: {
options: {
