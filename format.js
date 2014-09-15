var _ = require('underscore');

module.exports = function format(options) {
  options = options || {};

  var formattedOptions = {
    name: 'app'
  , js: {
      src: './src/**/*.js'
    , app: './src/app.js'
    , lint: require('./jshint.default.cfg')
    }
  , css: {
      src: './src/**/*.less{,.css}'
    , app: './src/app.less'
    , lint: require('./recess.default.cfg')
    }
  , html: {
      src: './src/**/*.html' 
    }
  , test: {
      src: './test/**/*.js'
    , app: './test/app.js'
    }
  , build: {
      dest: './build'
    }
  , dist: {
      dest: './dist'
    }
  , report: {
      dest: './report'
    }
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
  if (!_.isUndefined(options.testSrc)) formattedOptions.test.src = options.testSrc;
  if (!_.isUndefined(options.testApp)) formattedOptions.test.app = options.testApp;

  //- BUILD
  if (!_.isUndefined(options.buildDest)) formattedOptions.build.dest = options.buildDir;

  //- DIST
  if (!_.isUndefined(options.distDest)) formattedOptions.dist.dest = options.distDir;

  //- REPORTS
  if (!_.isUndefined(options.reportDest)) formattedOptions.report.dest = options.reportDir;

  return formattedOptions;
};
