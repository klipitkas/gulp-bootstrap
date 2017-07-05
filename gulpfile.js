/* Gulp Build File */
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    cssBase64 = require('gulp-css-base64'),
    path = require('path'),
    notify = require('gulp-notify'),
    inlinesource = require('gulp-inline-source'),
    browserSync = require('browser-sync'),
    imagemin = require('gulp-imagemin'),
    del = require('del'),
    cache = require('gulp-cache'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    runSequence = require('run-sequence');

/* CSS Compile & Prefix & Minify */
gulp.task('compile-css', function(){
    return gulp.src('./src/css/*.css')
        .pipe(cssBase64())
        .pipe(autoprefixer())
        .pipe(gulp.dest('./dist/css/'))
        .pipe(browserSync.reload({ stream:true }))
        .pipe(notify('CSS compiled successfully!'));
});

/* JS Compile & Minify */
gulp.task('compile-js', function(){
    return gulp.src('./src/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'))
        .pipe(notify('JS compiled successfully!'));
});

/* Images Minify */
gulp.task('imagemin', function(){
    return gulp.src('./src/img/**/*.+(png|jpg|jpeg|gif|svg)')
        // Caching images that ran through imagemin
        .pipe(cache(imagemin({ interlaced: true })))
        .pipe(gulp.dest('./dist/img/'))
        .pipe(notify('Images minified successfully!'));
});

//Copy fonts to dist
gulp.task('fonts', function() {
    return gulp.src(['./src/fonts/*'])
        .pipe(gulp.dest('dist/fonts/'));
});

// BrowserSync live reload
gulp.task('browserSync', function() {
    browserSync({ server: { baseDir: './src/'}, injectChanges: true });
});

// Will compile all inline within the html file (less http requests - woot!)
gulp.task('inlinesource', function () {
    return gulp.src('./src/*.html')
        .pipe(inlinesource())
        .pipe(gulp.dest('./dist/'));
});

// Gulp watch
gulp.task('watch', ['browserSync'], function() {
    gulp.watch('./src/fonts/**');
    gulp.watch('./src/css/**', ['compile-css']);
    gulp.watch('./src/img/**');
    gulp.watch('./src/*.html').on('change', browserSync.reload);
});

// Gulp clean up
gulp.task('clean', function() {
    del('dist');
});

// Gulp default task
gulp.task('default', ['watch']);

// Gulp build task
gulp.task('build', function() {
    runSequence(
        'clean', 
        'compile-css', 
        'compile-js', 
        'imagemin', 
        'fonts',
        'inlinesource'
    );
});
