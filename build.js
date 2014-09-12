var gulp = require('gulp')
  , util = require('gulp-util')
  , rename = require('gulp-rename')
  , less = require('gulp-less')
  , autoprefixer = require('gulp-autoprefixer')
  , watchify = require('watchify')
  , browserify = require('browserify')
  , source = require('vinyl-source-stream')
  , clean = require('./clean');

module.exports.js = function js(options, cb) {
  options = options || {};
  if (!options.app || !options.dest || !options.name) return cb(new Error('(BuildJS) app, dest and name are required.'));

  var compiler = watchify(browserify(options.app));

  compiler.on('update', compile);
  compiler.on('error', util.log);
  compile();

  function compile() {
    clean({src: options.dest + '/' + (options.name || '**/*') + '.js'}, function(err) {
      if (err) return cb(err);
      util.log('Browserifying ' + util.colors.blue(options.app) + ' into ' + util.colors.blue(options.dest + '/' + options.name + '.js'));

      return compiler.bundle()
        .pipe(source(options.name + '.js'))
        .pipe(gulp.dest(options.dest))
        .on('end', cb || function() {})
        .on('error', cb || util.log);
    });
  }
};

module.exports.css = function css(options, cb) {
  options = options || {};
  if (!options.app || !options.dest || !options.name) return cb(new Error('(BuildCSS) app, dest and name are required.'));

  clean({src: options.dest + '/' + (options.name || '**/*') + '.css'}, function(err) {
    if (err) return cb(err);
    util.log('Compiling ' + util.colors.blue(options.app) + ' into ' + util.colors.blue(options.dest + '/' + options.name + '.css'));
    
    gulp.src(options.app)
      .pipe(autoprefixer("last 2 versions", "> 1%", "ie 8"))
      .pipe(less())
      .pipe(rename(options.name + '.css'))
      .pipe(gulp.dest(options.dest))
      .on('end', cb || function() {})
      .on('error', cb || util.log);
  });
};

module.exports.html = function html(options, cb) {
  options = options || {};
  if (!options.src || !options.dest) return cb(new Error('(BuildHTML) src and dest are required.'));
  util.log('Moving ' + util.colors.blue(options.src) + ' to ' + util.colors.blue(options.dest));

  gulp.src(options.src)
    .pipe(gulp.dest(options.dest))
    .on('end', cb || function() {})
    .on('error', cb || util.log);
}
