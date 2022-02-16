module.exports = function (grunt) {

grunt.registerTask('init-dev-env', 'Initialize dev environment.', function () {
var fs = require('fs')
var done = this.async()

fs.symlink('../../tasks/lib/validate-commit-msg.js', '.git/hooks/commit-msg', function (e) {
if (!e) {
grunt.log.ok('Hook "validate-commit-msg" installed.')
}
done()
