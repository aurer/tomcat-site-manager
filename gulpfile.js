var gulp = require('gulp'),
	less = require('gulp-less'),
	browserify = require('gulp-browserify'),
	server = require('browser-sync'),
	plumber = require('gulp-plumber'),
	del = require('del'),
	runSequence = require('run-sequence'),
	uglify = require('gulp-uglify'),
	zip = require('gulp-zip');

// Compile less
gulp.task('less', function() {
	return gulp.src(['./src/less/app.less'])
		.pipe(plumber())
		.pipe(less())
		.pipe(gulp.dest('./build/extension/css'))
		.pipe(server.stream());
});

// Compile JS
gulp.task('js', function() {
	return gulp.src('./src/js/main.js')
		.pipe(plumber())
		.pipe(browserify({
			transform: ["babelify"]
		}))
		.pipe(gulp.dest('./build/extension/js'))
		.pipe(server.stream());
});

gulp.task('uglify', function() {
	return gulp.src('./build/extension/js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('./build/extension/js'));
});

// Copy html and manifest files
gulp.task('copy', function() {
	gulp.src('src/img/*').pipe(gulp.dest('./build/extension/img'));
	gulp.src('src/manifest.json').pipe(gulp.dest('./build/extension'));
	gulp.src('src/html/index.html').pipe(gulp.dest('./build/extension'));
});

// Clean the build folder
gulp.task('clean', function() {
	return del('./build/*');
});

// Watch for changes
gulp.task('watch', function() {
	gulp.watch('src/less/**/*.less', ['less']);
	gulp.watch('src/js/**/*.js', ['js']);
	gulp.watch(['src/html/*.html', 'src/img/*', 'src/manifest.json'], ['copy']);
});

// Setup local server with injection
gulp.task('serve', function() {
	server.init({
		server: {
			baseDir: './build/extension'
		}
	});
});

gulp.task('default', function(callback) {
	runSequence('clean', 'copy', 'less', 'js', callback);
});

gulp.task('dev', ['default', 'watch', 'serve']);

gulp.task('apply-production', function() {
	process.env.NODE_ENV = 'production';
});

gulp.task('zip', function() {
	const fs = require('fs');
	var manifest = fs.readFileSync('./src/manifest.json');
	var version = JSON.parse(manifest).version;

	return gulp.src('./build/extension/*')
		.pipe(zip('tomcat-site-manager-' + version + '.zip'))
		.pipe(gulp.dest('./build'));
})

gulp.task('build', function() {
	runSequence('apply-production', 'clean', 'copy', 'less', 'js', 'uglify', 'zip');
});
