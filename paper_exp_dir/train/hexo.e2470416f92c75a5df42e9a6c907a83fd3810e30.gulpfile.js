var gulp = require('gulp'),
$ = require('gulp-load-plugins')(),
path = require('path');

var lib = 'lib/**/*.js',
test = 'test/scripts/**/*.js';

gulp.task('mocha', function(){
return gulp.src('test/index.js')
.pipe($.mocha({
reporter: 'spec',
