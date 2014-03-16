var gulp = require('gulp'),
    gutil = require('gulp-util')

gulp.task('stylus', function () {
    var stylus = require('gulp-stylus'),
        autoprefixer = require('gulp-autoprefixer'),
        minify = require('gulp-minify-css');

    gulp.src('./assets/styl/main.styl')
        .pipe(stylus({ paths: ['./styl/*.styl'] }))
        .pipe(autoprefixer())
        .pipe(minify())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('js', function () {
    var uglify = require('gulp-uglify');

    gulp.src('./assets/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./public/js'));

    gulp.src('./public/lib/fastclick/lib/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./public/lib/fastclick/build'));
});

gulp.task('lint', function () {
    var jshint = require('gulp-jshint'),
        stylish = require('jshint-stylish');

    gulp.src(['./assets/js/custom.js', 'server.js', 'app/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('images', function () {
    var imagemin = require('gulp-imagemin');

    gulp.src('assets/images/**/*')
        .pipe(imagemin({progressive: true}))
        .pipe(gulp.dest('./public/images'));
});

gulp.task('server', ['default'], function () {
    var nodemon = require('nodemon');

    nodemon({
        'script': 'server.js',
        'ignore': ['.git', 'public/**', 'assets/**']
    }).on('start', function () {
        gutil.log('Nodemon has started the server');
    });
});

gulp.task('watch', ['default'], function () {
    gulp.watch('assets/styl/**', ['stylus']);
    gulp.watch('assets/js/**', ['lint', 'js']);
});

gulp.task('deploy', function () {
    var shell = require('shelljs');

    if (!shell.which('git')) {
        console.error('You need git installed to deploy.');
        exit(1);
    }

    // add the build directory
    if (shell.exec('git add --force ./public/**/*').code !== 0) {
        console.error('Failed to add build directory to commit');
        shell.exit(1);
    }

    // create a new commit with the build directory
    if (shell.exec('git commit -m "Add the build folder"').code !== 0) {
        console.error('Committing changes failed');
        shell.exit(1);
    }

    // push our changes to a remote named heroku
    if (shell.exec('git push --force heroku master').code !== 0) {
        console.error('Pushing to heroku failed');
        shell.exit(1);
    }

    // undo our commit
    if (shell.exec('git reset --hard HEAD~1').code !== 0) {
        console.error('Reverting our commit failed');
        shell.exit(1);
    }
});

gulp.task('default', ['stylus', 'js', 'lint', 'images']);