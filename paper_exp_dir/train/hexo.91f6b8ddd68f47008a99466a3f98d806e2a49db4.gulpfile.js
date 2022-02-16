var gulp = require('gulp'),
jshint = require('gulp-jshint'),
mocha = require('gulp-mocha'),
path = require('path');

var lib = 'lib/**/*.js',
test = 'test/scripts/**/*.js';

var handleError = function(err){
console.error(err.stack);
this.emit('end');
}

gulp.task('hexo', function(callback){
require('./lib/init')(path.join(__dirname, 'test', 'blog'), {
_: [],
silent: true,
