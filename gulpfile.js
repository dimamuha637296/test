const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const imgCompress = require('imagemin-jpeg-recompress');

const scssFiles = [
    './src/scss/_values.scss',
    './src/scss/_mixins.scss',
    './src/scss/_base.scss',
    './src/scss/style.scss'
];

const cssFiles = [
    './src/css/style.css'
];

const jsFiles = [
    './src/js/jquery-3.3.1.min.js',
    './src/js/script.js'
];


function stylesSCSS() {
    return gulp.src(scssFiles)
                // Из SASS в CSS
                .pipe(sass().on('error', sass.logError))
                // Объединение всех скомпиленых SCSS в один
                .pipe(concat('style.css'))
                // Сохранение итогового файла основных стилей
                .pipe(gulp.dest('./src/css'));
}

function styles() {
    // return gulp.src('./src/css/**/*.css')
    return gulp.src(cssFiles)
                // Объединение
                .pipe(concat('style.css'))
                // Префиксы
                .pipe(autoprefixer({
                    browsersList: ['> 0.1%'],
                    cascade: false
                }))
                // Минификация CSS
                .pipe(cleanCSS({
                    level: 0
                }))
                // Сохранение итогового файла стилей
                .pipe(gulp.dest('./build/css'))
                .pipe(browserSync.stream());
}

function scripts() {
    return gulp.src(jsFiles)
        // Объединение
        .pipe(concat('script.min.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        // Минификация
        .pipe(uglify({
            toplevel: true
        }))
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.stream());
}

function images() {
    return gulp.src('src/img/**/*')
        .pipe(imagemin([
            imgCompress({
                loops: 6,
                min: 70,
                max: 80,
                quality: 'medium'
            }),
            imagemin.gifsicle(),
            imagemin.optipng(),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest('build/img'));
}

function fonts() {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('build/fonts'));
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        tunnel: false
    });
    gulp.watch('./src/scss/**/*.scss', stylesSCSS);
    gulp.watch('./src/css/**/*.css', styles);
    gulp.watch('./src/js/**/*.js', scripts);
    gulp.watch('./*.html', browserSync.reload);
}

function clean() {
    return del(['build/*']);
}

gulp.task('fonts', fonts);
gulp.task('images', images);
gulp.task('stylesSCSS', stylesSCSS);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('watch', watch);
gulp.task('clean', clean);
gulp.task('build', gulp.series(clean,
    gulp.series(stylesSCSS,
        gulp.parallel(styles, scripts, images, fonts)
    )
));

gulp.task('dev', gulp.series('build', 'watch'));
