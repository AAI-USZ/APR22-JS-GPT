module.exports = function(grunt) {

var exec = require('child_process').exec;
var changelog = require('./../scripts/changelog');
var semver = require('semver');

var DESC = 'Generate changelog.';
grunt.registerTask('changelog', DESC, function(type) {

var done = this.async();
var pkg = grunt.file.readJSON(grunt.config('pkgFile'));
var newVersion = semver.inc(pkg.version, type || 'patch');


