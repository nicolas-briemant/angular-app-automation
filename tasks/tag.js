var gulp = require('gulp')
  , util = require('gulp-util')
  , git = require('gulp-git');

module.exports = function tag(options, cb) {
  options = options || {};
  if (!options.version || !options.src) throw new util.PluginError('Tag (git)', 'version and src are required.');

  var message = 'release ' + options.version;
  util.log('Tagging (git) ' + util.colors.blue(message));

  gulp.src(options.src)
    .pipe(git.commit(message))
    .pipe(git.tag(options.version, message))
    .pipe(git.push('origin', 'master', '--tag'))
    .pipe(gulp.dest(options.src))
    .on('end', cb || function() {})
    .on('error', cb || util.log);
};

