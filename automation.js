'use strict';

var _ = require('underscore')
  , async = require('async')
  , glob = require('glob')
  , util = require('gulp-util')
  , format = require('./tasks/format')
  , clean = require('./tasks/clean')
  , build = require('./tasks/build')
  , server = require('./tasks/server')
  , complexity = require('./tasks/complexity')
  , coveralls = require('./tasks/coveralls')
  , fingerprint = require('./tasks/fingerprint')
  , size = require('./tasks/size')
  , karma = require('karma');

module.exports = function(gulp, options) {
  var options = format(options);

  function error(err) {
    if (err) {
      util.log(util.colors.red(err));
      process.exit(1);
    }
  }

  function dev(devOptions, cb) {
    async.series([
      clean.bind(null, {src: options.dirs.build})
    , build.all.bind(null, _.extend({dest: options.dirs.build, watch: true}, devOptions), options)
    , size.bind(null, {src: options.dirs.build})
    , fingerprint.bind(null, options)
    ], function(err) {
      if (err) return error(err);

      gulp.watch(
        options.css.src
      , build.css.bind(null, _.extend(options.css, {dest: options.dirs.build, name: options.name}), null)
      );

      gulp.watch(
        options.html.src
      , build.html.bind(null, {src: options.html.src, dest: options.dirs.build}, null)
      );

      util.log(util.colors.yellow('Watching sources for updates'));

      cb();
    });
  }

  gulp.task('dev', function(cb) { dev({debug: false},cb); });
  gulp.task('dev:sm', function(cb) { dev({debug: true}, cb); });

  gulp.task('dev:lr', ['dev'], function(cb) {
    server(_.extend(options.server, {src: options.dirs.build}), function(err, notifier) {
      if (err) return error(err);

      gulp.watch(options.dirs.build + '**/*', notifier);

      cb();
    });
  });

  gulp.task('dev:unit', ['dev'], function(cb) {
    build.js(_.extend(options.test.unit, {dest: options.dirs.build, watch: true}), function(err) {
      if (err) return error(err);

      var karmaOptions = {
        singleRun: false
      , autoWatch: true
      , files: [options.dirs.build + '/*.js']
      };

      karma.server.start(_.extend(options.karma, karmaOptions), cb);
    });
  });

  gulp.task('dist:build', function(cb) {
    async.series([
      clean.bind(null, {src: options.dirs.dist})
    , build.all.bind(null, {dest: options.dirs.dist, min: true}, options)
    , fingerprint.bind(null, options)
    , size.bind(null, {src: options.dirs.build})
    ], function(err) {
      if (err) return error(err);

      util.log(util.colors.green('Distribution ready in ' + options.dirs.dist));

      cb();
    });
  });

  gulp.task('dist:serve', ['dist:build'], function(cb) {
    server(_.extend(options.server, {src: options.dirs.dist}), cb);
  });

  gulp.task('complexity:report', function() {
    complexity(_.extend(options.js, {dest: options.dirs.complexity}));
  });

  gulp.task('complexity:serve', ['complexity:report'], function(cb) {
    server(_.extend(options.server, {src: options.dirs.complexity}), cb);
  });

  gulp.task('coverage:report', function(cb) {
    async.parallel([
      clean.bind(null, {src: options.dirs.coverage})
    , build.js.bind(null, _.extend(options.js, {dest: options.dirs.build, coverage: true}))
    , build.js.bind(null, _.extend(options.test.unit, {dest: options.dirs.build}))
    ], function(err) {
      if (err) return error(err);

      var karmaOptions = {
        singleRun: true
      , autoWatch: false
      , files: [options.dirs.build + '/*.js']
      , reporters: ['progress', 'coverage']
      , coverageReporter: {type : 'html', dir : options.dirs.coverage}
      };

      karma.server.start(_.extend(options.karma, karmaOptions), cb);
    });
  });

  gulp.task('coverage:serve', ['coverage:report'], function(cb) {
    glob(options.dirs.coverage + '/PhantomJS*', function(err, files) {
      if (err || files.length !== 1) return error(err);

      server(_.extend(options.server, {src: _.first(files)}), cb);
    });
  });

  gulp.task('ci', function(cb) {
    async.series([
      clean.bind(null, {src: options.dirs.dist})
    , build.all.bind(null, {dest: options.dirs.dist, min: true, coverage: true}, options)
    , clean.bind(null, {src: options.dirs.coverage})
    , build.js.bind(null, _.extend(options.test.unit, {dest: options.dirs.dist}))
    ], function(err) {
      if (err) return error(err);

      var karmaOptions = {
        singleRun: true
      , autoWatch: false
      , files: [options.dirs.dist + '/*.js']
      , reporters: ['progress', 'coverage']
      , coverageReporter: {type : 'lcov', dir : options.dirs.coverage}
      };

      karma.server.start(
        _.extend(options.karma, karmaOptions)
      , coveralls.bind(null, {src: options.dirs.coverage + '/**/lcov.info'}, cb)
      );
    });
  });
};
