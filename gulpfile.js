const gulp = require('gulp'),

      // helpers
      autoprefixer = require('gulp-autoprefixer'),
      concat = require("gulp-concat"),
      imagemin = require('gulp-imagemin'),
      cleancss = require('gulp-clean-css')
      stylus = require('gulp-stylus'),
      uglify = require('gulp-uglify'),

      paths = {
        js: {
          src: ["./src/js/custom.js"], // array (not glob) for concat purposes
          dest: "./assets/js/"
        },
        styl: {
          src: "./src/styl/main.styl",
          all: ["./src/styl/**/*.styl"],
          dest: "./assets/css/"
        },
        img: {
          all: ["./src/images/**/*"],
          dest: "./assets/images"
        }
      }

// compile stylesheets
gulp.task('stylus', function () {
  return gulp.src(paths.styl.src)
    .pipe(stylus({ paths: paths.styl.all }))
    .pipe(autoprefixer())
    .pipe(cleancss({compatibility: 'ie8'}))
    .pipe(gulp.dest(paths.styl.dest));
});

// minify all javascript
gulp.task('js', function () {
  return gulp.src(paths.js.src)
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js.dest));
});

// minify images
gulp.task('images', function () {
  return gulp.src(paths.img.all)
    .pipe(imagemin({progressive: true}))
    .pipe(gulp.dest(paths.img.dest));
});

// watch files for changes and livereload the browser
gulp.task('watch', function () {
  gulp.watch(paths.styl.all, ['stylus']);
  gulp.watch(paths.js.all, ['lint', 'js']);
});

// run all of the compilation-related tasks
gulp.task('compile', ['stylus', 'js', 'images']);

// by default, compile and start watching for changes
gulp.task('default', ['compile', 'watch']);
