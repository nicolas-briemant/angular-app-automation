var gulp = require('gulp')
  , util = require('gulp-util')
  , del = require('del');

module.exports = function clean(options, cb) {
  cb = cb || util.log;

  options = options || {};
  if (!options.src) return cb(new Error('(Cleaning) src is required.'));

  util.log('Cleaning ' + util.colors.blue(options.src));

  del(options.src, cb);
};
