module.exports = function(grunt) {
var TRAVIS = process.env.TRAVIS;
var BROWSERS = TRAVIS ? 'Firefox' : 'Chrome,ChromeCanary,Firefox,Opera,Safari,PhantomJS';


grunt.registerMultiTask('test', 'Run tests.', function() {
var specDone = this.async();


if (this.target === 'e2e') {
var tests = grunt.file.expand(this.data);
var cmd = './bin/testacular';
var args = [
null, '--single-run', '--no-auto-watch', '--reporter=dots', '--browsers=' + BROWSERS
];

var next = function(err, result, code) {
if (code) {
console.error(err);
grunt.fail.fatal('E2E test "' + args[0] + '" failed.', code);
} else {
args[0] = tests.shift();
