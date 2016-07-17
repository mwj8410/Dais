const concat = require('gulp-concat-util');
const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('default', ['stage'])

  // Composit Tasks
  .task('watch', ['style:stage', 'style:watch'])
  .task('build', ['style:stage_styles', 'style:stage_components'])

  // Styles
  .task('style:stage_styles', function () {
    return gulp.src(
      [
        'src/plinth.scss',
      ])
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('dist/'));
  })
  .task('style:stage_components', function () {
    return gulp.src(
      [
        'src/components/plinth.components.scss',
        '!src/components/*/*.scss'
      ])
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('dist/'));
  })
  .task('style:watch', function () {
    gulp.watch('src/**/*.scss', ['style:stage']);
  })
;
