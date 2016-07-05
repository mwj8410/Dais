var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var sass = require('gulp-sass');

gulp.task('default', ['stage'])

  // Composit Tasks
  .task('watch', ['style:stage', 'style:watch'])
  .task('build', ['style:stage' ])

  // Styles
  .task('style:stage', function () {
    return gulp.src(
      [
        'dist/sass/**/*.scss',
      ])
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('demo/'));
  })
  .task('style:watch', function () {
    gulp.watch('dist/**/*.scss', ['style:stage']);
  })
;
