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
test: {
unit: 'mochaTest:unit',
client: 'test/client/karma.conf.js',
e2e: 'cucumberjs:ci'
},
mochaTest: {
options: {
reporter: 'dot',
ui: 'bdd',
quiet: false,
