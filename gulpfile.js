const { src, dest, watch, series, parallel } = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const cleanCss = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;

// 1. Стилі (SCSS -> CSS)
function styles() {
    return src('src/scss/main.scss')
        .pipe(scss().on('error', scss.logError))
        .pipe(concat('main.min.css'))
        .pipe(cleanCss())
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream());
}

// 2. Скрипти (JS)
function scripts() {
    return src('src/js/script.js')
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream());
}

// 3. Копіювання HTML
function html() {
    return src('src/*.html')
        .pipe(dest('dist'))
        .pipe(browserSync.stream());
}

// 4. КОПІЮВАННЯ КАРТИНОК (Без стиснення, щоб не було помилок)
function assets() {
    // Ми беремо всі файли з img, навіть якщо там немає папки logo чи icons
    return src('src/img/**/*', { encoding: false })
        .pipe(dest('dist/img'));
}

// 5. Сервер та відстеження змін
function serve() {
    browserSync.init({
        server: {
            baseDir: "./dist" // Запускаємо саме з dist
        },
        port: 3000,
        notify: false
    });

    watch("src/scss/**/*.scss", styles);
    watch("src/js/**/*.js", scripts);
    watch("src/*.html", html);
    watch("src/img/**/*", assets);
}

// Головна команда: npx gulp
exports.default = series(
    parallel(styles, scripts, html, assets),
    serve
);