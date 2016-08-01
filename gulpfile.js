'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var uncss = require('gulp-uncss');
var shorthand = require('gulp-shorthand');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var minify = require('gulp-minify-css');

gulp.task('sass', function () {
    gulp.src('sass/**/*.scss')
        .pipe(sass())
        .pipe(postcss([autoprefixer({browsers: ['last 2 versions']})]))
        .pipe(shorthand())
        .pipe(minify())
        .pipe(gulp.dest('css')) 
        .pipe(plumber({
            errorHandler: onError
        }))
});

function onError(err) {
    console.log(err);
}

gulp.task('swatch', function () {
    gulp.watch('sass/**/*.scss', ['sass']);
});


gulp.task('default', ['swatch']);