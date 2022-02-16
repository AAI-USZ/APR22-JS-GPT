module.exports = function(grunt) {
var TRAVIS = process.env.TRAVIS;
var BROWSERS = TRAVIS ? 'Firefox' : 'Chrome,ChromeCanary,Firefox,Opera,Safari,PhantomJS';


grunt.registerMultiTask('test', 'Run tests.', function() {
var specDone = this.async();


if (this.target === 'e2e') {
var tests = grunt.file.expand(this.data);
