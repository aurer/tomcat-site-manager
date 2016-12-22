var gulp = require('gulp'),
less = require('gulp-less'),
babel = require('gulp-babel'),
babelify = require('babelify'),
browserify = require('gulp-browserify'),
server = require('browser-sync'),
plumber = require('gulp-plumber'),
del = require('del'),
runSequence = require('run-sequence'),
uglify = require('gulp-uglify'),
rename = require('gulp-rename');

// Compile less
gulp.task('less', function() {
	return gulp.src(['./src/less/main.less', './src/less/light-theme.less'])
	.pipe(plumber())
	.pipe(less())
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

gulp.task('compress', function() {
	return gulp.src('./build/js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('./build/js'));
});

gulp.task('apply-production', function() {
  process.env.NODE_ENV = 'production';
});

// Copy html and manifest files
gulp.task('copy', function() {
	gulp.src('src/img/*').pipe(gulp.dest('build/img'));
	gulp.src('src/manifest.json').pipe(gulp.dest('build/'));
	gulp.src('src/html/index.html').pipe(gulp.dest('build'))
		.pipe(rename('sites.html')).pipe(gulp.dest('build'))
		.pipe(rename('settings.html')).pipe(gulp.dest('build'));
});

// Clean the build folder
gulp.task('clean', function() {
	return del('build/*');
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
	runSequence('clean', 'copy', 'less', 'js', callback);
});

gulp.task('dev', ['default', 'watch', 'serve']);

gulp.task('build', () => {
	runSequence('apply-production', 'default', 'compress');
});
