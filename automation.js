'use strict';

var _ = require('underscore')
  , async = require('async')
  , util = require('gulp-util')
  , format = require('./format')
  , clean = require('./clean')
  , build = require('./build')
  , lint = require('./lint')
  , server = require('./server')
  , plato = require('./plato')
  , karma = require('karma');

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
      + util.colors.green('\ndev:fast') + util.colors.cyan(' fast developement workflow (without unit tests)')
        + '\n- build (browserify, less, sourcemaps, autoprefixer)'
        + '\n- serve application (express)'
        + '\n- provide linting (non-blocking) for js (jshint) and css (recess)'
        + '\n- connected browsers will automatically refresh when files are updated (livereload)'
      + util.colors.green('\ndev:unit') + util.colors.cyan(' test (unit) driven developement workflow')
        + '\n- rely on dev:fast task'
        + '\n- run tests using karma through jasmine DSL'
      + util.colors.green('\ndist:build') + util.colors.cyan(' build dist')
        + '\n- build (browserify, less, autoprefixer)'
        + '\n- minify js (uglify2, supports angular DI) and css (csso)'
      + util.colors.green('\ndist:serve') + util.colors.cyan(' serve dist build for checking purpose')
    );

    cb();
  });

  gulp.task('dev', function(cb) {
    async.series({
      'clean': clean.bind(null, {src: options.dirs.build})
    , 'build': build.all.bind(null, {dest: options.dirs.build, watch: true}, options)
    , 'notifier': server.bind(null, {src: options.dirs.build})
    }, function(err, r) {
      if (err) return error(err);

      gulp.watch(
        options.css.src
      , build.css.bind(null, _.extend(options.css, {dest: options.dirs.build, name: options.name}), null)
      );
      gulp.watch(
        options.html.src
      , build.html.bind(null, {src: options.html.src, dest: options.dirs.build}, null)
      );

      gulp.watch(options.dirs.build + '**/*', r.notifier);

      cb();
    });
  });

  gulp.task('dev:unit', ['dev'], function(cb) {
    build.js(_.extend(options.test.unit, {dest: options.dirs.test, watch: true}), function(err) {
      if (err) return error(err);

      var karmaUnitOptions = {
        singleRun: false
      , autoWatch: true
      , files: [options.dirs.build + '/*.js', options.dirs.test + '/*.js']
      };

      karma.server.start(_.extend(options.karma, karmaUnitOptions));

      cb();
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

  gulp.task('plato:report', function() {
    plato(_.extend(options.js, {dest: options.dirs.report + '/plato'}));
  });

  gulp.task('plato:serve', ['plato:report'], function(cb) {
    server({src: options.dirs.report + '/plato'}, cb);
  });
};
