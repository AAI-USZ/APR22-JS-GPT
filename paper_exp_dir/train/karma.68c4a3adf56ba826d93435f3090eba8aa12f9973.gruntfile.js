module.exports = function (grunt) {
grunt.initConfig({
mochaTest: {
options: {
reporter: 'dot',
ui: 'bdd',
quiet: false,
colors: true
},
unit: {
src: [
'test/unit/mocha-globals.js',
