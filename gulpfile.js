var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var mainBowerFiles = require('main-bower-files');
var bump = require('gulp-bump');
var git = require('gulp-git');
var fs = require('fs');

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

gulp.task('tag', function (cb) {
  var version = getPackageJsonVersion();

  git.tag(version, 'Created Tag for version: ' + version, function (error) {
    if (error) {
      return cb(error);
    }
  });

  function getPackageJsonVersion () {
    // We parse the json file instead of using require because require caches
    // multiple calls so the version number won't be updated
    return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
  };
});

gulp.task('bump', function () {
  return gulp.src(['./bower.json', './package.json'])
    .pipe(bump({type: "patch"}).on('error', gutil.log))
    .pipe(gulp.dest('./'));
});

gulp.task('push', function() {
  git.push('origin', 'master', { args: '--folow-tags' })
});

