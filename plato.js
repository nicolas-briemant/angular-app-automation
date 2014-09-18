var gulp = require('gulp')
  , util = require('gulp-util')
  , plato = require('gulp-plato');

module.exports = function _plato(options, cb) {
  options = options || {};
  if (!options.src || !options.dest || !options.lint) throw new util.PluginError('PLATO', 'src, dest and lint are required.');

  util.log('Generating plato report of ' + util.colors.blue(options.src) + ' in ' + util.colors.blue(options.dest));

  gulp.src(options.src)
    .pipe(plato(options.dest, {jshint: {options: options.lint}}))
    .on('end', cb || function() {})
    .on('error', cb || util.log);
};
