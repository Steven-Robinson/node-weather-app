var gulp = require('gulp'),
	fs = require('fs');

gulp.task('default', function () {
	console.log('App interface; Commands: boot');
});

gulp.task('boot', function () {
	fs.createReadStream('./config.json.dist')
		.pipe(fs.createWriteStream('./config.json'));
});
