return gulp.src('test/index.js')
gulp.watch(['test/index.js', test], ['mocha']);
