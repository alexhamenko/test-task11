
const gulp = require('gulp'),
      concat = require('gulp-concat'),
      autoprefixer = require('gulp-autoprefixer'),
      cleanCSS = require('gulp-clean-css'),
      uglify = require('gulp-uglify'),
      del = require('del'),
      sass = require('gulp-sass'),
      sourcemaps = require('gulp-sourcemaps'),
      browserSync = require('browser-sync').create();

const scssFiles = [
    './src/styles/scss/main.scss',
]

const jsFiles = [
    './src/js/lib.js',
    './src/js/main.js'
]

function scripts() {
    return gulp.src(jsFiles)
        .pipe(concat('script.js'))
        .pipe(uglify({
            toplevel: true //true - для сокращения названий функций
        }))
        .pipe(gulp.dest('./build/js/'))
}

function sassCompile () {
    return gulp.src(scssFiles)
        .pipe(concat('style.scss'))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./src/styles/'))
        .pipe(browserSync.stream());
}

function css() {
    return gulp.src('./src/styles/style.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(gulp.dest('./build/css/'))
        .pipe(browserSync.stream());
}

function clean () {
    return del(['build/*'])
}


function watch(done){
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('./src/styles/scss/**/*.scss', sassCompile)
    gulp.watch('./src/styles/**/*.css', css)
    gulp.watch('./src/js/**/*.js', scripts)
    gulp.watch("./*.html").on('change', browserSync.reload);
    
    done()
}

gulp.task('sassCompile', sassCompile); //('styles', styles) -> ('произвольное название', имя выполняемой функции)

gulp.task('css', css);

gulp.task('styles', gulp.series(sassCompile, css));

gulp.task('scripts', scripts);

gulp.task('del', clean);

gulp.task('watch', watch);

gulp.task('build', gulp.series(clean, gulp.parallel('styles', scripts)));

gulp.task('run', gulp.series('build', 'watch'));

