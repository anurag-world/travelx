const { src, dest, series, parallel, watch } = require('gulp')
const del = require('del')
const browserSync = require('browser-sync').create()
const sass = require('gulp-sass')
const babel = require('gulp-babel')
const autoprefixer = require('gulp-autoprefixer')
const concat = require('gulp-concat')

// Define
const origin = 'src'
const destination = 'build'

// Compiler
sass.compiler = require('node-sass')

// Delete Build Folder
async function clean(cb) {
  await del(destination)
  cb()
}

// HTML
function html() {
  return src(`${origin}/**/*.html`).pipe(dest(destination))
}

// CSS
function css(cb) {
  src([`${origin}/css/reset.css`, `${origin}/css/style.scss`])
    .pipe(
      sass({
        outputStyle: 'compressed',
      })
    )
    .pipe(autoprefixer())
    .pipe(concat('style.css'))
    .pipe(dest(`${destination}/css`))

  src([`${origin}/css/bootstrap.scss`, `${origin}/css/fontawesome.scss`])
    .pipe(
      sass({
        outputStyle: 'compressed',
      })
    )
    .pipe(dest(`${destination}/css`))
  cb()
}

// JS
function js(cb) {
  src(`${origin}/js/lib/**/*.js`).pipe(dest(`${destination}/js/lib`))
  src([`${origin}/js/script.js`])
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(concat('script.js'))
    .pipe(dest(`${destination}/js`))
  cb()
}

// Image
function img() {
  return src(`${origin}/img/**/*`).pipe(dest(`${destination}/img`))
}

// Watch Files
function watcher(cb) {
  watch(`${origin}/*.html`).on('change', series(html, browserSync.reload))
  watch(`${origin}/**/*.css`).on('change', series(css, browserSync.reload))
  watch(`${origin}/**/*.scss`).on('change', series(css, browserSync.reload))
  watch(`${origin}/**/*.js`).on('change', series(js, browserSync.reload))
  watch(`${origin}/img/**/*`).on('change', series(img, browserSync.reload))
  cb()
}

// BrowserSync Server
function server(cb) {
  browserSync.init({
    notify: false,
    server: {
      baseDir: destination,
    },
  })
  cb()
}

// Exports
exports.default = series(clean, parallel(html, css, js, img), server, watcher)
