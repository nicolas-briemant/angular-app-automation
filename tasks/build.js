var gulp = require('gulp')
  , util = require('gulp-util')
  , rename = require('gulp-rename')
  , less = require('gulp-less')
  , autoprefixer = require('gulp-autoprefixer')
  , sourcemaps = require('gulp-sourcemaps')
  , gulpif = require('gulp-if')
  , csso = require("gulp-csso")
  , uglify = require('gulp-uglify')
  , streamify = require('gulp-streamify')
  , watchify = require('watchify')
  , browserify = require('browserify')
  , source = require('vinyl-source-stream')
  , ngAnnotate = require('gulp-ng-annotate')
  , clean = require('./clean')
  , lint = require('./lint')
  , async = require('async')
  , _ = require('underscore');

module.exports.all = function all(buildOptions, options, cb) {
  async.parallel([
    js.bind(this, _.extend(options.js, buildOptions))
  , css.bind(this, _.extend(options.css, buildOptions))
  , html.bind(this, {src: options.html.src, dest: buildOptions.dest})
  ], cb);
};

var js = module.exports.js = function js(options, cb) {
  options = options || {};
  if (!options.app || !options.dest || !options.name) throw new util.PluginError('BuildJS', 'app, dest and name are required.');

  var compiler = browserify(_.extend(watchify.args, {entries: [options.app], extensions: ['.js'], debug: true}));
  // debug is for source maps

  if (options.watch) {
    compiler = watchify(compiler);
    compiler.on('update', compile);
    compiler.on('error', util.log);
  }

  compile();

  function compile(wargs) {
    async.series([lint.js.bind(null, options)], function(err) {
      if (err) return cb ? cb(err) : util.log(err);
      util.log('Browserifying ' + util.colors.blue(options.app) + ' into ' + util.colors.blue(options.dest + '/' + options.name + '.js'));

      return compiler.bundle()
        .pipe(source(options.name + '.js'))
        .pipe(gulpif(options.min, streamify(ngAnnotate())))
        .pipe(gulpif(options.min, streamify(uglify())))
        .pipe(gulp.dest(options.dest))
        .on('end', wargs ? function() {} : cb || function() {})
        .on('error', cb || util.log);
    });
  }
};

var css = module.exports.css = function css(options, cb) {
  options = options || {};
  if (!options.app || !options.dest || !options.name) throw new util.PluginError('BuildCSS', 'app, dest and name are required.');

  async.series([lint.css.bind(null, options)], function(err) {
    if (err) return cb ? cb(err) : util.log(err);
    util.log('Compiling ' + util.colors.blue(options.app) + ' into ' + util.colors.blue(options.dest + '/' + options.name + '.css'));
    
    gulp.src(options.app)
      // .pipe(sourcemaps.init())
      .pipe(autoprefixer("last 2 versions", "> 1%", "ie 8"))
      .pipe(less())
      .pipe(rename(options.name + '.css'))
      .pipe(gulpif(options.min, csso()))
      // .pipe(sourcemaps.write())
      .pipe(gulp.dest(options.dest))
      .on('end', cb || function() {})
      .on('error', cb || util.log);
  });
};

var html = module.exports.html = function html(options, cb) {
  options = options || {};
  if (!options.src || !options.dest) throw new util.PluginError('BuildHTML', 'src and dest are required.');

  util.log('Moving ' + util.colors.blue(options.src) + ' to ' + util.colors.blue(options.dest));

  gulp.src(options.src)
    .pipe(gulp.dest(options.dest))
    .on('end', cb || function() {})
    .on('error', cb || util.log);
};
