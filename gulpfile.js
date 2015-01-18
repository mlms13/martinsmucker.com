var gulp = require('gulp'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify');

// compile stylesheets
gulp.task('stylus', function () {
    var stylus = require('gulp-stylus'),
        autoprefixer = require('gulp-autoprefixer'),
        minify = require('gulp-minify-css');

    return gulp.src('./assets/styl/main.styl')
        .pipe(stylus({ paths: ['./styl/*.styl'] }))
        .pipe(autoprefixer())
        .pipe(minify())
        .pipe(gulp.dest('./public/css'));
});

// minify all javascript
gulp.task('js', function () {
    var concat = require('gulp-concat')

    return gulp.src([
        './assets/lib/jquery.js',
        './assets/lib/fastclick.js',
        './assets/js/custom.js'])
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js'));
});

// run scripts through jshint
gulp.task('lint', function () {
    var jshint = require('gulp-jshint'),
        stylish = require('jshint-stylish');

    return gulp.src(['./assets/js/custom.js', 'server.js', 'app/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

// duplicate any other scripts from assets to public
gulp.task('duplicate:js', function () {
    return gulp.src([
        './assets/js/modernizr.js',
        './assets/js/rotmg/autocomplete.js',
        './assets/js/rotmg/roll.js',
        './assets/js/rotmg/fame.js',
        './assets/lib/respond.min.js'])
        .pipe(uglify())
        .pipe(gulp.dest('./public/js'));
});

// duplicate all other assets into the public folder
gulp.task('duplicate:assets', function () {
    return gulp.src(['./assets/fonts/**/*'], {base: './assets'})
        .pipe(gulp.dest('./public'));
});

// minify images
gulp.task('images', function () {
    var imagemin = require('gulp-imagemin');

    return gulp.src('assets/images/**/*')
        .pipe(imagemin({progressive: true}))
        .pipe(gulp.dest('./public/images'));
});

// start the server and restart when changes happen
gulp.task('server', function () {
    var nodemon = require('nodemon');

    nodemon({
        'script': 'server.js',
        'ignore': ['.git', 'public/**', 'assets/**']
    }).on('start', function () {
        gutil.log('Nodemon has started the server');
    });
});

// watch files for changes and livereload the browser
gulp.task('watch', function () {
    var lr = require('gulp-livereload'),
        server = lr();

    gulp.watch('assets/styl/**', ['stylus']);
    gulp.watch('assets/js/**', ['lint', 'js']);
    gulp.watch('public/**').on('change', function (file) {
        server.changed(file.path);
    });
});

// push everything to heroku
gulp.task('deploy', ['compile'], function () {
    var shell = require('shelljs');

    if (!shell.which('git')) {
        console.error('You need git installed to deploy.');
        shell.exit(1);
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

// run all of the compilation-related tasks
gulp.task('compile', ['stylus', 'js', 'lint', 'images', 'duplicate:js', 'duplicate:assets']);

// by default, compile everything, watch for changes, and start the server
gulp.task('default', ['compile', 'watch', 'server'], function () {
    var open = require('open');
    open('http://localhost:3000');
});