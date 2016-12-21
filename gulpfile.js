var gulp = require('gulp'),
less = require('gulp-less'),
babel = require('gulp-babel'),
babelify = require('babelify'),
browserify = require('gulp-browserify'),
server = require('browser-sync'),
plumber = require('gulp-plumber'),
del = require('del'),
runSequence = require('run-sequence'),
CleanCss = require('less-plugin-clean-css');

// Compile less
gulp.task('less', function() {
	return gulp.src('./src/less/main.less')
	.pipe(plumber())
	.pipe(less({
		plugins: [new CleanCss()]
	}))
	.pipe(gulp.dest('./build/css'))
	.pipe(server.stream());
});

// Compile JS
gulp.task('js', function() {
	return gulp.src('./src/js/main.js')
	.pipe(plumber())
	.pipe(browserify({
		transform: ["babelify"]
	}))
	.pipe(gulp.dest('./build/js'))
	.pipe(server.stream());
});

// Copy html and manifest files
gulp.task('copy', function() {
	gulp.src(['src/img/*']).pipe(gulp.dest('build/img'));
	gulp.src(['src/html/*.html', 'src/manifest.json']).pipe(gulp.dest('build/'));
});

// Clean the build folder
gulp.task('clean', function() {
	return del('build/*');
});

// Build the safari extension from the build folder
gulp.task('safari', function() {
	gulp.src(['build/**/*', '!build/manifest.json', 'src/info.plist']).pipe(gulp.dest('Tomcat.safariextension'));
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
			baseDir: './build'
		}
	});
});

gulp.task('default', function(callback) {
	return runSequence('clean', 'copy', 'less', 'js', callback);
});

gulp.task('dev', ['default', 'watch', 'serve']);
