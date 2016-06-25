var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var sass = require('gulp-sass');

gulp.task('default', ['stage'])

  // Composit Tasks
  .task('watch', ['style:stage', 'style:watch'])
  .task('build', ['style:stage', 'style:minify' ])
  
  // Styles
  .task('style:stage', function () {
    return gulp.src(
      [
        'dist/sass/**/*.scss',
      ])
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('dist/css/'));
  })
  .task('style:minify', function () {
    return gulp.src(
      [
        'dist/css/*.css',
        '!dist/css/*-min.css'
      ])
      .pipe(cleanCSS())
      .pipe(rename(function (path) {
        path.basename += "-min";
      }))
      .pipe(gulp.dest('dist/css/'));
  })
  .task('style:watch', function () {
    gulp.watch('dist/**/*.scss', ['style:stage']);
  })
;
