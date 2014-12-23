var gulp = require('gulp');
var gutil = require("gulp-util");

gulp.task('scripts-bundle', function (cb) {
    var Duo = require("duo");
    var fs = require('fs');
    var typescript = require('../duo-typescript');
    
    var duo = new Duo(process.cwd())
    duo
      .entry('example/index.ts')
      .use(typescript())
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