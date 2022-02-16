var gulp = require('gulp'),
jshint = require('gulp-jshint'),
mocha = require('gulp-mocha'),
path = require('path');

var lib = 'lib/**/*.js',
test = 'test/scripts/**/*.js';

gulp.task('mocha', function(){
return gulp.src('test/index.js')
.pipe(mocha({
reporter: 'spec',
ignoreLeaks: true
}));
});

gulp.task('jshint', function(){
return gulp.src(lib)
