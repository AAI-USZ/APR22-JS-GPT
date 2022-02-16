module.exports = function(grunt) {

var exec = require('child_process').exec;


grunt.registerTask('npm-show', 'Show files that would be published to npm.', function() {
var done = this.async();

exec('npm pack', function(err, pkgFile) {
exec('tar -tf ' + pkgFile, function(err, pkgContent) {
console.log(pkgContent);
exec('rm ' + pkgFile, done);
