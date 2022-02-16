module.exports = function(grunt) {

var exec = require('child_process').exec;


grunt.registerTask('bump', 'Increment version, generate changelog, create tag and push to github.', function(type) {

var finish = this.async();
var queue = [];
var next = function() {
var cmd = queue.shift();

if (!cmd) return finish();

