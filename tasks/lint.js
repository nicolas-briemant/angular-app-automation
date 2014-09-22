var gulp = require('gulp')
  , util = require('gulp-util')
  , jshint = require('gulp-jshint')
  , recess = require('gulp-recess')
  , async = require('async');

var js = module.exports.js = function js(options, cb) {
  options = options || {};
  if (!options.src || !options.lint) throw new util.PluginError('LintJS', 'src and lint are required.');

  util.log('Linting (jshint) ' + util.colors.blue(options.src));

  gulp.src(options.src)
    .pipe(jshint(options.lint))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(gulp.dest('./.tmp')) // only to emit an end event
    .on('end', cb || function() {})
    .on('error', cb || util.log);
};

var css = module.exports.css = function css(options, cb) {
  options = options || {};
  if (!options.src || !options.lint) throw new util.PluginError('LintCSS', 'src and lint are required.');

  util.log('Linting (recess) ' + util.colors.blue(options.src));

  gulp.src(options.src)
    .pipe(recess(options.lint))
    .pipe(recess.reporter())
    .pipe(gulp.dest('./.tmp')) // only to emit an end event
    .on('end', cb || function() {})
    .on('error', cb || util.log);
};

module.exports.all = function all(options, cb) {
  async.parallel([
    js.bind(null, options.js)
  , css.bind(null, options.css)
  ], cb);
};
