'use strict';

var _ = require('underscore')
  , async = require('async')
  , glob = require('glob')
  , util = require('gulp-util')
  , format = require('./tasks/format')
  , clean = require('./tasks/clean')
  , build = require('./tasks/build')
  , server = require('./tasks/server')
  , plato = require('./tasks/plato')
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
    plato(_.extend(options.js, {dest: options.dirs.plato}));
  });

  gulp.task('plato:serve', ['plato:report'], function(cb) {
    server({src: options.dirs.plato}, cb);
  });

  gulp.task('coverage:report', function(cb) {
    async.parallel([
      clean.bind(null, {src: options.dirs.coverage})
    , build.js.bind(null, _.extend(options.js, {dest: options.dirs.build, coverage: true}))
    , build.js.bind(null, _.extend(options.test.unit, {dest: options.dirs.test}))
    ], function(err) {
      if (err) return error(err);

      var karmaCoverageOptions = {
        singleRun: true
      , autoWatch: false
      , files: [options.dirs.build + '/*.js', options.dirs.test + '/*.js']
      , reporters: ['progress', 'coverage']
      , coverageReporter: {type : 'html', dir : options.dirs.coverage}
      };

      karma.server.start(_.extend(options.karma, karmaCoverageOptions), cb);
    });
  });

  gulp.task('coverage:serve', ['coverage:report'], function(cb) {
    glob(options.dirs.coverage + '/PhantomJS*', function(err, files) {
      if (err || files.length !== 1) return error(err);

      server({src: _.first(files)}, cb);
    });
  })
};
