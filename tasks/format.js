var _ = require('underscore')
  , jsLintConfig = require('./jshint.default.cfg')
  , cssLintConfig = require('./recess.default.cfg')
  , karmaConfig = require('./karma.default.cfg');

module.exports = function format(options) {
  options = options || {};

  var formattedOptions = {
    name: 'app'
  , js: {
      src: './src/**/*.js'
    , app: './src/app.js'
    , lint: jsLintConfig
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
    , report: './report'
    , test: './test'
    }
  , karma: karmaConfig
  };

  //- GENERAL
  if (!_.isUndefined(options.pkg) && !_.isUndefined(options.pkg.name)) formattedOptions.name = options.pkg.name;
  if (!_.isUndefined(options.name)) name = formattedOptions.options.name;

  //- JS
  if (!_.isUndefined(options.jsSrc)) formattedOptions.js.src = options.jsSrc;
  if (!_.isUndefined(options.jsApp)) formattedOptions.js.app = options.jsApp;
  if (!_.isUndefined(options.jsLint)) formattedOptions.js.lint = _.extend(formattedOptions.js.lint, options.jsLint);

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
  if (!_.isUndefined(options.reportDir)) formattedOptions.dirs.report = options.reportDir;

  //- KARMA
  if (!_.isUndefined(options.karma)) formattedOptions.karma = _.extend(formattedOptions.karma, options.karma);

  //- ADJUSTEMENTS
  formattedOptions.js.src = [formattedOptions.js.src, '!' + formattedOptions.test.unit.src];

  //- SHORTCUTS
  formattedOptions.js.name = formattedOptions.css.name = formattedOptions.name;
  formattedOptions.test.unit.name = formattedOptions.name + '.unit';

  return formattedOptions;
};
