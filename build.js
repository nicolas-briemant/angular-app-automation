var gulp = require('gulp')
  , util = require('gulp-util')
  , rename = require('gulp-rename')
  , less = require('gulp-less')
  , autoprefixer = require('gulp-autoprefixer')
  , watchify = require('watchify')
  , browserify = require('browserify')
  , source = require('vinyl-source-stream')
  , clean = require('./clean')
  , lint = require('./lint')
  , async = require('async')
  , _ = require('underscore');

var js = module.exports.js = function js(options, cb) {
  options = options || {};
  if (!options.app || !options.dest || !options.name) return cb(new Error('(BuildJS) app, dest and name are required.'));

  var compiler = watchify(browserify(options.app, watchify.args));

  compiler.on('update', compile);
  compiler.on('error', util.log);
  compile();

  function compile(wargs) {
    async.series([
      clean.bind(null, {src: options.dest + '/' + (options.name || '**/*') + '.js'})
    , lint.js.bind(null, options)
    ], function(err) {
      if (err) return cb ? cb(err) : util.log(err);
      util.log('Browserifying ' + util.colors.blue(options.app) + ' into ' + util.colors.blue(options.dest + '/' + options.name + '.js'));

      return compiler.bundle()
        .pipe(source(options.name + '.js'))
        .pipe(gulp.dest(options.dest))
        .on('end', wargs ? function() {} : cb || function() {})
        .on('error', cb || util.log);
    });
  }
};

var css = module.exports.css = function css(options, cb) {
  options = options || {};
  if (!options.app || !options.dest || !options.name) return cb(new Error('(BuildCSS) app, dest and name are required.'));

  async.series([
    clean.bind(null, {src: options.dest + '/' + (options.name || '**/*') + '.css'})
  , lint.css.bind(null, options)
  ], function(err) {
    if (err) return cb ? cb(err) : util.log(err);
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

var html = module.exports.html = function html(options, cb) {
  options = options || {};
  if (!options.src || !options.dest) return cb(new Error('(BuildHTML) src and dest are required.'));

  clean({src: options.dest + '/**/*.html'}, function(err) {
    if (err) return cb ? cb(err) : util.log(err);
    util.log('Moving ' + util.colors.blue(options.src) + ' to ' + util.colors.blue(options.dest));

    gulp.src(options.src)
      .pipe(gulp.dest(options.dest))
      .on('end', cb || function() {})
      .on('error', cb || util.log);
  });
};

module.exports.all = function all(options, cb) {
  async.parallel([
    js.bind(null, _.extend(options.js, {dest: options.build.dest, name: options.name}))
  , css.bind(null, _.extend(options.css, {dest: options.build.dest, name: options.name}))
  , html.bind(null, {src: options.html.src, dest: options.build.dest})
  ], cb);
};
