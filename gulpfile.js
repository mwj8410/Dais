const babel = require('gulp-babel');
const concat = require('gulp-concat-util');
const gulp = require('gulp');
const jsx = require('gulp-jsx');
// const cleanCSS = require('gulp-clean-css');
// const rename = require('gulp-rename');
const sass = require('gulp-sass');

gulp.task('default', ['stage'])

  // Composit Tasks
  .task('watch', ['style:stage', 'style:watch'])
  .task('build', ['style:stage_styles', 'style:stage_components', 'js:stage' ])

  // Javascript
  .task('js:stage', function () {
    return gulp.src(
      [
        'src/components/**/*.component.js',
        'src/components/dais.components.js'
      ])
      .pipe(jsx({
        factory: 'React.createClass'
      }))
      .pipe(concat('dais.components.js'))
      .pipe(gulp.dest('dist/'));
  })

  // Styles
  .task('style:stage_styles', function () {
    return gulp.src(
      [
        'src/style/dais.scss',
      ])
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('dist/'));
  })
  .task('style:stage_components', function () {
    return gulp.src(
      [
        'src/components/dais.components.scss',
        '!src/components/*/*.scss'
      ])
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('dist/'));
  })
  .task('style:watch', function () {
    gulp.watch('src/**/*.scss', ['style:stage']);
  })
;
