module.exports = function (grunt) {
grunt.initConfig({
pkg: grunt.file.readJSON('package.json'),
pkgFile: 'package.json',
files: {
server: ['lib/**/*.js'],
client: ['client/**/*.js'],
grunt: ['grunt.js', 'tasks/*.js'],
scripts: ['scripts/init-dev-env.js']
},
browserify: {
client: {
files: {
'static/karma.js': ['client/main.js']
}
}
},
test: {
unit: 'mochaTest:unit',
client: 'test/client/karma.conf.js',
e2e: 'cucumberjs:ci'
},
watch: {
client: {
files: '<%= files.client %>',
tasks: 'browserify:client'
}
},
mochaTest: {
options: {
require: [
'babel/register'
],
reporter: 'dot',
ui: 'bdd',
quiet: false,
colors: true
},
unit: {
src: [
