var gulp = require('gulp')
  , util = require('gulp-util')
  , coveralls = require('gulp-coveralls');

module.exports = function(options, cb) {
  options = options || {};
  if (!options.src) throw new util.PluginError('Coveralls', 'src is required.');

  util.log('Coverallsing ' + util.colors.blue(options.src));

  gulp.src(options.src)
    .pipe(coveralls())
    .on('end', cb || function() {})
    .on('error', cb || util.log);
};

