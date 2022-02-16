module.exports = function(grunt) {
var TRAVIS = process.env.TRAVIS;
var BROWSERS = TRAVIS ? 'Firefox' : 'Chrome,ChromeCanary,Firefox,Opera,Safari,PhantomJS';


grunt.registerMultiTask('test', 'Run tests.', function() {
var specDone = this.async();

var exec = function(cmd, args, failMsg) {
var child = grunt.utils.spawn({cmd: cmd, args: args}, function(err, result, code) {
if (code) {
console.error(err);
grunt.fail.fatal(failMsg, code);
} else {
specDone();
}
});

