module.exports = function(grunt) {
var TRAVIS = process.env.TRAVIS;
var BROWSERS = TRAVIS ? 'Firefox' : 'Chrome';


grunt.registerMultiTask('test', 'Run tests.', function() {
var specDone = this.async();
var which = require('which').sync;
var path = require('path');

var exec = function(cmd, args, failMsg) {
var child = grunt.util.spawn({cmd: cmd, args: args}, function(err, result, code) {
if (code) {
console.error(err);
grunt.fail.fatal(failMsg, code);
} else {
specDone();
}
