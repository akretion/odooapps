var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var mainBowerFiles = require('main-bower-files');

gulp.task('lib', function() {
  return gulp.src(mainBowerFiles(), {base:'www/lib/'})
    .pipe(gulp.dest('dist/lib'));
});

gulp.task('install', function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('move', function() {
  return gulp.src(['www/**/*', '!./www/lib/**'])
    .pipe(gulp.dest('dist/'));
});

gulp.task('build', ['move', 'lib'], function() {
  return gulp.src('www/index.html')
    .pipe(gulp.dest('dist/'));
});
