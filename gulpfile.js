var concat = require('gulp-concat-util');
var gulp = require('gulp');
// var cleanCSS = require('gulp-clean-css');
// var rename = require('gulp-rename');
var sass = require('gulp-sass');

gulp.task('default', ['stage'])

  // Composit Tasks
  .task('watch', ['style:stage', 'style:watch'])
  .task('build', ['style:stage', 'js:stage' ])

  // Javascript
  .task('js:stage', function () {
    return gulp.src(
      [
        'src/components/**/*.component.js',
        'src/components/dais.components.js'
      ])
      .pipe(concat('dais.components.js'))
      .pipe(gulp.dest('dist/'));
  })

  // Styles
  .task('style:stage', function () {
    return gulp.src(
      [
        'src/**/*.scss',
        '!src/components/**/*.scss'
      ])
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('dist/'));
  })
  .task('style:watch', function () {
    gulp.watch('src/**/*.scss', ['style:stage']);
  })
;
