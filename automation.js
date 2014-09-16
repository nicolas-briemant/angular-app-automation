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

  gulp.task('dev', function(cb) {
    async.series({
      'clean': clean.bind(null, {src: options.build.dest})
    , 'build': build.all.bind(null, options)
    , 'notifier': server.bind(null, {src: options.build.dest})
    }, function(err, r) {
      if (err) return error(err);

      gulp.watch(
        options.css.src
      , build.css.bind(null, {app: options.css.app, dest: options.build.dest, name: options.name}, null)
      );
      gulp.watch(
        options.html.src
      , build.html.bind(null, {src: options.html.src, dest: options.build.dest}, null)
      );

      gulp.watch(options.build.dest + '**/*', r.notifier);
    });
  });
};
