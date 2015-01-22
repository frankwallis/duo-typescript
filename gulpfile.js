var gulp = require('gulp');
var gutil = require("gulp-util");
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');

gulp.task('test', function(cb) {
    gulp.src('lib/**/*.js')
        .pipe(istanbul())                   // instrument the files
        .on('finish', function () {
            gulp.src('test/*-spec.js')
                .pipe(mocha({reporter: 'nyan'}))
                .pipe(istanbul.writeReports())      // write coverage reports
                .on('end', cb)
        });
});

gulp.task('scripts-bundle', function (cb) {
    var Duo = require('duo');
    var fs = require('fs');
    var typescript = require('./');
    
    var duo = new Duo(process.cwd())
    duo
      .entry('example/index.ts')
      .development(true)
      .use(typescript({ sourceMap: true, target: 'es6' }))
      .run(function(err, src) {
            if (err) {
                gutil.log(err);
                cb();
            }
            else {
                var filename = 'build/build.js';
                fs.writeFile(filename, src, function(err) {
                    if (err) throw err;
                    gutil.log('Generated ' + filename);
                    cb();
                });
            }
        });

});


gulp.task('scripts', ['scripts-bundle']);
gulp.task('watch', ['watch-scripts']);
gulp.task('default', ['scripts']);