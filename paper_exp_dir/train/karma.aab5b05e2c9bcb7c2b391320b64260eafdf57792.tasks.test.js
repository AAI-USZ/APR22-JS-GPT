module.exports = function(grunt) {


grunt.registerMultiTask('test', 'Run tests.', function() {
var specDone = this.async();
var node = require('which').sync('node');
var path = require('path');
var cmd = path.join(__dirname, '..', 'bin', 'karma');

var spawnKarma = function(args, callback) {
grunt.log.writeln(['Running', cmd].concat(args).join(' '));
