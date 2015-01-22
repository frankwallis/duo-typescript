function capitalise(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = function(options) {
	options = options || {};
	
	// log like gulp or component depending on your taste
	if (options.gulpMode) {
		var gutil = require('gulp-util');
	
		return {
			log: function(arg1, arg2) {
				gutil.log(gutil.colors.cyan(capitalise(arg1)), arg2);
			},
			error: function(arg1, arg2) {
				gutil.log(gutil.colors.red(capitalise(arg1)), arg2);
			},
			warn: function(arg1, arg2) {
				gutil.log(gutil.colors.yellow(capitalise(arg1)), arg2);
			}
		}
	}
	else {
		return require('component-consoler');
	}
}
