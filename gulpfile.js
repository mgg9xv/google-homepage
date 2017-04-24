var gulp = require('gulp');
var gulpIf = require('gulp-if');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');

gulp.task('watch', ['browserSync', 'sass'],function(){
    gulp.watch('src/scss/*', ['sass']);
    gulp.watch('src/*.html', browserSync.reload);
});

gulp.task('browserSync', function(){
    browserSync.init({
        server: {
            baseDir: 'src'
        }
    })
});

gulp.task('sass', function(){
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('useref', function(){
    return gulp.src('src/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
    return gulp.src('src/images/**/*.+(png|jpg|jpeg|gif|svg|ico)')
        .pipe(imagemin({
            interlaced: true,
        }))
        .pipe(gulp.dest('dist/images'))
});

gulp.task('clean', function() {
    return del.sync('dist');
});

gulp.task('develop', function(callback) {
    runSequence(
        ['sass', 'browserSync'],
        'watch',
        callback
    )
});

gulp.task('build', function(callback) {
    runSequence(
        'clean',
        'sass',
        ['useref', 'images'],
        callback
    )
});
