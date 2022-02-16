module.exports = function(grunt) {

var exec = require('child_process').exec;


grunt.registerTask('bump', 'Increment version, generate changelog, create tag and push to github.', function(type) {

var finish = this.async();
var queue = [];
var next = function() {
var cmd = queue.shift();

if (!cmd) {
return finish();
}

exec(cmd[0], function(err, output) {
if (err) {
return grunt.fail.fatal(err.message.replace(/\n$/, '.'));
}
if (cmd[1]) {
grunt.log.ok(cmd[1]);
