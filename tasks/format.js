var _ = require('underscore')
  , jsLintConfig = require('../jshint.default.cfg')
  , cssLintConfig = require('../recess.default.cfg')
  , karmaConfig = require('../karma.default.cfg');

module.exports = function format(options) {
  options = options || {};

  var formattedOptions = {
    name: 'app'
  , version: '0.0.0-noversion'
  , server: {
      port: 5000
    , lrport: 5001
    }
  , js: {
      src: './src/**/*.js'
    , app: './src/app.js'
    , lint: jsLintConfig
    , jade: false
    }
  , css: {
      src: './src/**/*.less{,.css}'
    , app: './src/app.less'
    , lint: cssLintConfig
    }
  , html: {
      src: './src/**/*.html' 
    }
  , test: {
      unit: {
        src: './src/**/*.unit.js'
      , app: './src/app.unit.js'
      , lint: jsLintConfig
      }
    }
  , dirs: {
      build: './build'
    , dist: './dist'
    , coverage: './.coverage'
    , complexity: './.complexity'
    }
  , karma: karmaConfig
  };

  //- GENERAL
  if (!_.isUndefined(options.pkg) && !_.isUndefined(options.pkg.name)) formattedOptions.name = options.pkg.name;
  if (!_.isUndefined(options.pkg) && !_.isUndefined(options.pkg.version)) formattedOptions.version = options.pkg.version;
  if (!_.isUndefined(options.name)) name = formattedOptions.options.name;

  //- SERVER
  if (!_.isUndefined(options.port)) formattedOptions.server.port = options.port;
  if (!_.isUndefined(options.lrport)) formattedOptions.server.lrport = options.lrport;

  //- JS
  if (!_.isUndefined(options.jsSrc)) formattedOptions.js.src = options.jsSrc;
  if (!_.isUndefined(options.jsApp)) formattedOptions.js.app = options.jsApp;
  if (!_.isUndefined(options.jsLint)) formattedOptions.js.lint = _.extend(formattedOptions.js.lint, options.jsLint);
  if (!_.isUndefined(options.jsJade)) formattedOptions.js.jade = options.jsJade;

  //- LESS & CSS
  if (!_.isUndefined(options.cssSrc)) formattedOptions.css.src = options.cssSrc;
  if (!_.isUndefined(options.cssApp)) formattedOptions.css.app = options.cssApp;
  if (!_.isUndefined(options.cssLint)) formattedOptions.css.lint = _.extend(formattedOptions.css.lint, options.cssLint);

  //- HTML
  if (!_.isUndefined(options.htmlSrc)) formattedOptions.html.src = options.htmlSrc;

  //- TEST
  if (!_.isUndefined(options.testUnitApp)) formattedOptions.test.unit.app = options.testUnitApp;
  if (!_.isUndefined(options.testUnitSrc)) formattedOptions.test.unit.src = options.testUnitSrc;

  //- DIRS
  if (!_.isUndefined(options.buildDir)) formattedOptions.dirs.build = options.buildDir;
  if (!_.isUndefined(options.distDir)) formattedOptions.dirs.dist = options.distDir;

  //- KARMA
  if (!_.isUndefined(options.karma)) formattedOptions.karma = _.extend(formattedOptions.karma, options.karma);

  //- ADJUSTEMENTS
  formattedOptions.js.src = [formattedOptions.js.src, '!' + formattedOptions.test.unit.src];

  //- SHORTCUTS
  formattedOptions.js.name = formattedOptions.css.name = formattedOptions.name;
  formattedOptions.test.unit.name = formattedOptions.name + '.unit';

  return formattedOptions;
};
