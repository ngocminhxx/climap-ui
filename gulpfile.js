"use strict";

const del = require('del');
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cleanCss = require('gulp-clean-css');
const notify = require('gulp-notify');
const gutil = require('gulp-util');
const runSequence = require('run-sequence');
const gulpif = require('gulp-if');
const minimist = require('minimist');
const ejs = require('gulp-ejs');

/**********************************************
 *
 *
 *
 **********************************************/
const options = minimist(process.argv.slice(2), {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'development' } // NODE_ENVに指定がなければ開発モードをデフォルトにする
});
const isProduction = (options.env === 'production');// $ gulp --env production

console.log('env is ' + options.env);

/**********************************************
 *
 *
 *
 **********************************************/
const _sourceDir = './_source/';
const _htmlDir = './';
const _scssDir = [
  './scss/**/*.scss',
  './components/sematic-ui/css/*.scss',
  '!./scss/xxx.scss'
];
const _cssDir = './css/';
const componentsDir = './components/';

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
    .pipe(autoprefixer({
      browsers: [
        'last 2 versions',
        'Android 3',
        'ie <= 9'
      ]
    })
    )
    .pipe(cleanCss({
      format: {
        breaks: { // controls where to insert breaks
          afterAtRule: true, // controls if a line break comes after an at-rule; e.g. `@charset`; defaults to `false`
          afterBlockBegins: true, // controls if a line break comes after a block begins; e.g. `@media`; defaults to `false`
          afterBlockEnds: true, // controls if a line break comes after a block ends, defaults to `false`
          afterComment: true, // controls if a line break comes after a comment; defaults to `false`
          afterProperty: true, // controls if a line break comes after a property; defaults to `false`
          afterRuleBegins: true, // controls if a line break comes after a rule begins; defaults to `false`
          afterRuleEnds: true, // controls if a line break comes after a rule ends; defaults to `false`
          beforeBlockEnds: true, // controls if a line break comes before a block ends; defaults to `false`
          betweenSelectors: true // controls if a line break comes between selectors; defaults to `false`
        },
        indentBy: 2, // controls number of characters to indent with; defaults to `0`
        indentWith: 'space', // controls a character to indent with, can be `'space'` or `'tab'`; defaults to `'space'`
        spaces: { // controls where to insert spaces
          aroundSelectorRelation: true, // controls if spaces come around selector relations; e.g. `div > a`; defaults to `false`
          beforeBlockBegins: true, // controls if a space comes before a block begins; e.g. `.block {`; defaults to `false`
          beforeValue: true // controls if a space comes before a value; e.g. `width: 1rem`; defaults to `false`
        },
        wrapAt: false // controls maximum line length; defaults to `false`
      },
      level: 2
    })
    )
    .pipe(gulpif(isProduction, cleanCss()))
    .pipe(sourcemaps.write('./'))
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


/**********************************************
 *
 *
 *
 **********************************************/
gulp.task('html', function (callback) {
  updateSourceTime = Date.now();

  runSequence(
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


/**********************************************
 *
 *
 *
 **********************************************/
gulp.task('default', [
  'scss',
  'source',
  // 'html'
], function () {
  gulp.watch(_scssDir, [
    'scss'
  ]);

  gulp.watch(_sourceDir + '**/*', [
    'source'
  ]);

  // gulp.watch('ejs/**/*.ejs', [
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
