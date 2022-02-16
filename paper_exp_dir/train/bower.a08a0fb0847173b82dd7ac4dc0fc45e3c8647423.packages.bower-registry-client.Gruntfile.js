

module.exports = function (grunt) {

'use strict';

grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-simple-mocha');


grunt.initConfig({

jshint: {
files: [
'Gruntfile.js',
'lib/**/*.js',
'test/**/*.js'
],
options: {
jshintrc: '.jshintrc'
}
},

simplemocha: {
options: {
