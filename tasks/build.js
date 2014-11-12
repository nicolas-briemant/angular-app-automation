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
  , istanbul = require('browserify-istanbul')
  , source = require('vinyl-source-stream')
  , ngAnnotate = require('gulp-ng-annotate')
  , clean = require('./clean')
  , lint = require('./lint')
  , async = require('async')
  , _ = require('underscore')
  , jade = require('jadeify')
  , coffee = require('coffeeify');

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

  // debug is for source maps
  var bundle = browserify(_.extend(watchify.args, {entries: [options.app], extensions: ['.js'], debug: true}));

  if (options.coverage) bundle.transform(istanbul);
  if (options.jade) bundle.transform(jade);
  if (options.coffee) bundle.transform(coffee);

  if (options.watch) {
    bundle = watchify(bundle);
    bundle.on('update', compile);
    bundle.on('error', util.log);
  }

  compile();

  function compile(wargs) {
    var processors = [];
    if (options.useLint) processors.push(lint.js.bind(null, options));

    async.series(processors, function(err) {
      if (err) return cb ? cb(err) : util.log(err);
      util.log('Browserifying ' + util.colors.blue(options.app) + ' into ' + util.colors.blue(options.dest + '/' + options.name + '.js'));

      return bundle.bundle()
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

  var processors = [];
  if (options.useLint) processors.push(lint.css.bind(null, options));

  async.series(processors, function(err) {
    if (err) return cb ? cb(err) : util.log(err);
    util.log('Compiling ' + util.colors.blue(options.app) + ' into ' + util.colors.blue(options.dest + '/' + options.name + '.css'));
    if (options.useLint) {
      util.log(util.colors.red('Warning: recess is using less ~1.3.0 version.'));
      util.log(util.colors.red('If you are using recent directives, you may disable recess (with the cssUseLint boolean option)'));
    }
    
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
