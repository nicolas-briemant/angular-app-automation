var gulp = require('gulp')
  , util = require('gulp-util')
  , template = require('gulp-template');

module.exports = function(options, cb) {
  var version = options.version;
  if (!version) version = require('crypto').randomBytes(20).toString('hex');

  util.log('Fingerprinting index.html assets with ' + util.colors.blue(version));

  gulp.src(options.html.app)
    .pipe(template({version: version}))
    .pipe(gulp.dest(options.dirs.dist))
    .on('end', cb || function() {})
    .on('error', cb || util.log);
};
