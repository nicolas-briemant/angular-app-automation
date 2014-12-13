var gulp = require('gulp')
  , size = require('gulp-size')
  , util = require('gulp-util');

module.exports = function(options, cb) {
  options = options || {};
  if (!options.src) throw new util.PluginError('Size', 'src is required.');

  util.log('Sizing ' + util.colors.blue(options.src));

  gulp.src(options.src+'/*.{js,css,html}')
    .pipe(size({title: '|-Size of', showFiles: true}))
    .pipe(gulp.dest('./.tmp')) // only to emit an end event
    .on('end', cb || function() {})
    .on('error', cb || util.log);
}
