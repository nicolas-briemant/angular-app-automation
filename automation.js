'use strict';

var _ = require('underscore')
  , async = require('async')
  , util = require('gulp-util')
  , del = require('del')
  , source = require('vinyl-source-stream')
  , watchify = require('watchify')
  , browserify = require('browserify')
  , gutil = require('gulp-util')
  , sourcemaps = require('gulp-sourcemaps')
  , concat = require('gulp-concat')
  , rename = require('gulp-rename')
  , connect = require('gulp-connect')
  , watch = require('gulp-watch')
  , less = require('gulp-less')
  , recess = require('gulp-recess')
  , autoprefixer = require('gulp-autoprefixer')
  , jshint = require('gulp-jshint')
  , karma = require('karma').server
  , stylish = require('jshint-stylish')
  , format = require('./format')
  , clean = require('./clean')
  , build = require('./build')
  , server = require('./server');

module.exports = function(gulp, options) {
  var options = format(options);
  console.log(options)

  function error(err) {
    if (err) {
      util.log(util.colors.red(err));
      process.exit(1);
    }
  }

  function buildAll(cb) {
    async.auto({
      'clean': clean.bind(null, {src: options.buildDir})
    , 'build.js': ['clean', build.js.bind(null, options.js)]
    , 'build.css': ['clean', build.css.bind(null, options.css)]
    , 'build.html': ['clean', build.html.bind(null, options.html)]
    }, function(err) {
      error(err);
      return cb ? cb() : process.exit(0);
    });
  }

  gulp.task('dev', function(cb) {
    async.series({
      'build': buildAll
    , 'notifier': server.bind(null, {src: options.buildDir})
    }, function(err, r) {
      error(err);
      gulp.watch(options.jsSrc, build.js.bind(null, options.js, null));
      gulp.watch(options.cssSrc, build.css.bind(null, options.css, null));
      gulp.watch(options.htmlSrc, build.html.bind(null, options.html, null));
      gulp.watch(options.buildDir + '**/*', r.notifier);
    });
  });

  // //- ----------
  // //- CLEAN
  // //- ----------
  // gulp.task('clean:build', function(cb) {
  //   del([buildDir], cb);
  // });
  //
  // gulp.task('clean:js', function(cb) {
  //   del([buildDir + '/**/*.js{,map}'], cb);
  // });
  //
  // gulp.task('clean:css', function(cb) {
  //   del([buildDir + '/**/*.css{,map}'], cb);
  // });
  //
  // //- ----------
  // //- LINT
  // //- ----------
  // gulp.task('lint:js', function() {
  //   return gulp.src(jsSrc)
  //     .pipe(jshint(jshintCfg))
  //     .pipe(jshint.reporter(stylish));
  // });
  //
  // gulp.task('lint:css', function() {
  //   return gulp.src(cssSrc)
  //     .pipe(recess(recessCfg));
  // });
  //
  // //- ----------
  // //- BUILD
  // //- ----------
  // gulp.task('build:js:watch', ['clean:js'], function() {
  //   var bundler = watchify(browserify(jsApp, watchify.args));
  //   bundler.on('update', rebundle);
  //   return rebundle();
  //
  //   function rebundle() {
  //     return bundler.bundle()
  //       .pipe(source(name + '.js'))
  //       .pipe(gulp.dest(buildDir))
  //       .pipe(connect.reload());
  //   }
  // });
  //
  // gulp.task('build:css', ['clean:css'], function() {
  //   return gulp.src(cssApp)
  //     .pipe(autoprefixer("last 2 versions", "> 1%", "ie 8"))
  //     .pipe(sourcemaps.init())
  //     .pipe(less())
  //     .pipe(rename(name + '.css'))
  //     .pipe(sourcemaps.write())
  //     .pipe(gulp.dest(buildDir))
  //     .pipe(connect.reload());
  // });
  //
  // gulp.task('build:views', function() {
  //   return gulp.src(htmlSrc)
  //     .pipe(gulp.dest(buildDir));
  // });
  //
  // //- ----------
  // //- CONNECT
  // //- ----------
  // gulp.task('connect', function() {
  //   connectCfg.root = buildDir;
  //   connect.server(connectCfg);
  // });
  //
  // //- ----------
  // //- WATCH
  // //- ----------
  // gulp.task('watch', function() {
  //   gulp.watch(cssSrc, ['build:css']);
  //   gulp.watch(htmlSrc, ['build:views']);
  // });
};
