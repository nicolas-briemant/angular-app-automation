'use strict';

var _ = require('underscore')
  , async = require('async')
  , util = require('gulp-util')
  , format = require('./format')
  , clean = require('./clean')
  , build = require('./build')
  , lint = require('./lint')
  , server = require('./server');

module.exports = function(gulp, options) {
  var options = format(options);

  function error(err) {
    if (err) {
      util.log(util.colors.red(err));
      process.exit(1);
    }
  }

  gulp.task('default', function(cb) {
    util.log('Available tasks:'
      + util.colors.green('\ndev') + util.colors.cyan(' lite developement workflow (without tests) ')
        + '\n- build (browserify, less, sourcemaps, autoprefixer)'
        + '\n- serve application (express)'
        + '\n- provide linting (non-blocking) for js (jshint) and css (recess)'
        + '\n- connected browsers will automatically refresh when files are updated (livereload)'
      + util.colors.green('\ndist:build') + util.colors.cyan(' distribution building workflow ')
        + '\n- build (browserify, less, autoprefixer)'
        + '\n- minify js (uglify2, supports angular DI) and css (csso)'
      + util.colors.green('\ndist:serve') + util.colors.cyan(' serve distribution for checking purpose')
    );
    cb();
  });

  gulp.task('dev', function() {
    async.series({
      'clean': clean.bind(null, {src: options.dirs.build})
    , 'build': build.all.bind(null, {dest: options.dirs.build, watch: true}, options)
    , 'notifier': server.bind(null, {src: options.dirs.build})
    }, function(err, r) {
      if (err) return error(err);

      gulp.watch(
        options.css.src
      , build.css.bind(null, {app: options.css.app, dest: options.dirs.build, name: options.name}, null)
      );
      gulp.watch(
        options.html.src
      , build.html.bind(null, {src: options.html.src, dest: options.dirs.build}, null)
      );

      gulp.watch(options.dirs.build + '**/*', r.notifier);
    });
  });

  gulp.task('dist:build', function(cb) {
    async.series([
      clean.bind(null, {src: options.dirs.dist})
    , build.all.bind(null, {dest: options.dirs.dist, min: true}, options)
    ], function(err) {
      if (err) return error(err);
      util.log(util.colors.green('Distribution ready in ' + options.dirs.dist));
      cb();
    });
  });

  gulp.task('dist:serve', ['dist:build'], function(cb) {
    server({src: options.dirs.dist}, cb);
  });
};
