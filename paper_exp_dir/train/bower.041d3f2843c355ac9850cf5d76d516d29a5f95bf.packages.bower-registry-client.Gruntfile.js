'use strict';
module.exports = function (grunt) {
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-simple-mocha');

grunt.initConfig({
jshint: {
files: [
'Gruntfile.js',
