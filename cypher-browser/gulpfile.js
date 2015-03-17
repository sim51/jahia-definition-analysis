var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    exec = require('gulp-exec'),
    bower = require('gulp-bower'),
    livereload = require('gulp-livereload'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    clean = require('gulp-clean'),
    connect = require('gulp-connect');

application = {
    less : {
        src : ['./app/less/**/*.less'],
        dest: "./app/build/css"
    },
    js : {
        src : ['./app/js/**/*.js'],
        dest : "./app/build/js/"
    }
};


/**
 * Default task
 */
gulp.task("default", ["watch"]);

/**
 * Build all project source.
 */
gulp.task("build", ["clean","less", "js"]);

/**
 * JS Hint task.
 */
gulp.task('jshint', function() {
    gulp.src(application.js.src)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

/**
 * LESS compilation.
 */
gulp.task('less', function() {
    gulp.src('./app/less/main.less')
        .pipe(less())
        .pipe(minifyCSS())
        .pipe(gulp.dest(application.less.dest));
});

/**
 * Concat & minify JS application files.
 */
gulp.task('js', function(){
    gulp.src(application.js.src)
        .pipe(concat('main.js'))
        //.pipe(uglify())
        .pipe(gulp.dest(application.js.dest));
});

/**
 * Clean task
 */
gulp.task('clean', function() {
    gulp.src('app/build', {read: false}).pipe(clean());
});


/**
 * Gulp watch : on each change file.
 */
gulp.task('watch', function() {

    gulp.src(application.js.src, { read: false})
        .pipe(watch({ emit: 'all' }, function(files) {
            gulp.run("js");

            files
                .pipe(jshint())
                .pipe(connect.reload())
                .pipe(jshint.reporter('default'));
        }));

    gulp.src(application.less.src, { read: false})
        .pipe(watch({ emit: 'all' }, function (files) {
            gulp.run("less");

            files
                .pipe(connect.reload());
        }));

    gulp.src("./app/**/*.html", { read: false})
        .pipe(watch({ emit: 'all' }, function (files) {
            files
                .pipe(connect.reload());
        }));
});

/**
 * Server task
 */
gulp.task('webserver', function() {
  connect.server({
    port: 8001,
    livereload: true
  });
});

gulp.task('default', ['clean', 'webserver', 'watch']);