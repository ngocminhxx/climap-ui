"use strict";

const del          = require('del');
const gulp         = require('gulp');
const sass         = require('gulp-sass');
const postcss      = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps   = require('gulp-sourcemaps');
const cleanCss     = require('gulp-clean-css');
const notify       = require('gulp-notify');
const htmllint     = require('gulp-htmllint');
const gutil        = require('gulp-util');
const bootlint     = require('gulp-bootlint');
const runSequence  = require('run-sequence');
const gulpif       = require('gulp-if');
const minimist     = require('minimist');
const ejs          = require('gulp-ejs');

const fs           = require('fs');
const browserslistrc = JSON.parse(fs.readFileSync('./config/.browserslistrc'));
const cleanCssConfig = JSON.parse(fs.readFileSync('./config/cleanCss.config.json'));

/**********************************************
 *
 *
 *
 **********************************************/
const options = minimist(process.argv.slice(2), {
  string: 'env',
  default: {env: process.env.NODE_ENV || 'development'} // NODE_ENVに指定がなければ開発モードをデフォルトにする
});
const isProduction = (options.env === 'production');// $ gulp --env production

console.log('env is ' + options.env);

/**********************************************
 *
 *
 *
 **********************************************/
const baseDir = './';
const _sourceDir    = baseDir + '_source/';
const _htmlDir      = baseDir + 'xxxxx/';
const _scssDir      = [
  baseDir + 'scss/**/*.scss',
  '!./scss/xxx.scss'
];
const _cssDir       = baseDir + 'css/';
const componentsDir = baseDir + 'components/';

const htmlFiles = [
  _htmlDir + '**/*.html',
  '!' + _sourceDir + '**/*.html',
  '!' + componentsDir + '**/*.html',
  '!node_modules/**/*.html'
];

let updateSourceTime;

/**********************************************
 *
 *
 *
 **********************************************/
gulp.task("scss", function () {
  const startTime = Date.now();

  gulp.src(_scssDir)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer({
      browsers: browserslistrc
    })]))
    .pipe(cleanCss(cleanCssConfig))
    .pipe(gulpif(isProduction, cleanCss()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(_cssDir))
    .pipe(notify({
      onLast: true,
      title: "SCSS build is finished!",
      message: Date.now() - startTime + ' ms'
    }));
});

/**********************************************
 *
 *
 *
 **********************************************/
gulp.task('clean-source', function (cb) {
  return del([
    componentsDir + '*'
  ], cb);
});

gulp.task('copy-source', function () {
  return gulp.src([
    // _sourceDir + 'bower_components/bootstrap-sass/assets/fonts/**/*',
    _sourceDir + '**/*.min.css',
    _sourceDir + '**/*.min.js',
    _sourceDir + '**/*-min.js',
    _sourceDir + '**/bower_components/slick-carousel/slick/slick.css',
    _sourceDir + '**/bower_components/slick-carousel/slick/ajax-loader.gif',
    '!' + _sourceDir + '**/docs/**',
    '!' + _sourceDir + 'bower_components/matchHeight/jquery.matchHeight-min.js',
    '!' + _sourceDir + 'bower_components/jquery/external/**/*',
    '!' + _sourceDir + 'bower_components/html5shiv/dist/html5shiv-printshiv.min.js',
    '!' + _sourceDir + 'bower_components/respond/dest/respond.matchmedia.addListener.min.js'
  ], {
    base: _sourceDir
  })
    .pipe(gulp.dest(componentsDir))
    .pipe(notify({
      onLast: true,
      title: "source task is finished!",
      message: Date.now() - updateSourceTime + ' ms'
    }));
});

gulp.task('source', function (callback) {
  updateSourceTime = Date.now();

  runSequence(
    'clean-source',
    'copy-source',
    callback
  )
});

/**********************************************
 *
 *
 *
 **********************************************/
gulp.task('remove-html', function (cb) {
  return del([
    _htmlDir + '*.html'
  ], {
    force: false
  }, cb);
});

/**********************************************
 *
 *
 *
 **********************************************/
gulp.task("ejs", function () {
  return gulp.src([
    "ejs/**/*.ejs",
    "!ejs/inc/*.ejs"
  ])
    .pipe(ejs({}, {}, {
      "ext": ".html"
    }))
    .pipe(gulp.dest("./build"));
});

/**********************************************
 *
 *
 *
 **********************************************/
gulp.task('htmllint', function () {
  return gulp.src(htmlFiles)
    .pipe(htmllint({
      'config': 'config/.htmllintrc'
    }, htmllintReporter));
});

function htmllintReporter(filepath, issues) {
  if (issues.length > 0) {
    issues.forEach(function (issue) {
      let name = gutil.colors.red('[gulp-htmllint Error] ');
      let path = gutil.colors.white(filepath + ' [Line: ' + issue.line + ', ' + issue.column + ']: ');
      let message = issue.msg;
      let issueCode = gutil.colors.red('(' + issue.code + ') ');
      let errorMessage = name + path + issueCode + message;

      gutil.log(errorMessage);
    });

    // process.exitCode = 0;
    process.exit(0);
  }
}

/**********************************************
 *
 *
 *
 **********************************************/
gulp.task('html', function (callback) {
  updateSourceTime = Date.now();

  runSequence(
    'remove-html',
    'ejs',
    'htmllint',
    callback
  )
});

/**********************************************
 *
 *
 *
 **********************************************/
gulp.task('bootlint', function() {
  return gulp.src('./index.html')
    .pipe(bootlint());
});

/**********************************************
 *
 *
 *
 **********************************************/
gulp.task('default', [
  'scss',
  'source',
  'htmllint',
  'bootlint',
  // 'html'
], function () {
  gulp.watch(_scssDir, [
    'scss'
  ]);

  gulp.watch(htmlFiles, [
    'htmllint',
    'bootlint'
  ]);

  // gulp.watch(_sourceDir + '**/*', [
  //   'source'
  // ]);

  // gulp.watch('ejs/**/*.ejs', [
  //   'remove-html',
  //   'ejs'
  // ]);
});

/**********************************************
 *
 *
 *
 **********************************************/
gulp.task('scss-watch', ['scss'], function () {
  gulp.watch('scss/**/*.scss', [
    'scss'
  ]);
});

/**********************************************
 *
 *
 *
 **********************************************/
gulp.task('html-watch', ['html'], function () {
  gulp.watch('ejs/**/*.ejs', [
    'html'
  ]);
});
