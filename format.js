var _ = require('underscore');

module.exports = function format(options) {
  options = options || {};

  var jsSrc = './src/**/*.js';
  if (!_.isUndefined(options.jsSrc)) jsSrc = options.jsSrc;

  var cssSrc = './src/**/*.less';
  if (!_.isUndefined(options.cssSrc)) cssSrc = options.cssSrc;

  var htmlSrc = './src/**/*.html';
  if (!_.isUndefined(options.htmlSrc)) htmlSrc = options.htmlSrc;

  var testSrc = './test/**/*.js';
  if (!_.isUndefined(options.testSrc)) testSrc = options.testSrc;

  var jsApp = './src/app.js';
  if (!_.isUndefined(options.jsApp)) jsApp = options.jsApp;

  var cssApp = './src/app.less';
  if (!_.isUndefined(options.cssApp)) cssApp = options.cssApp;

  var testApp = './test/app.js';
  if (!_.isUndefined(options.testApp)) testApp = options.testApp;

  var name = 'app';
  if (!_.isUndefined(options.pkg) && !_.isUndefined(options.pkg.name)) name = options.pkg.name;
  if (!_.isUndefined(options.name)) name = options.name;

  var buildDir = './build';
  if (!_.isUndefined(options.buildDir)) buildDir = options.buildDir;

  var distDir = './dist';
  if (!_.isUndefined(options.distDir)) distDir = options.distDir;

  var reportDir = './report';
  if (!_.isUndefined(options.reportDir)) reportDir = options.reportDir;

  var jshintCfg = _.extend(require('./jshint.cfg'), options.jshintCfg)
    , recessCfg = _.extend(require('./recess.cfg'), options.recessCfg)
    , karmaCfg = _.extend(require('./karma.cfg'), options.karmaCfg);

  var formattedOptions = {};
  formattedOptions.js = {app: jsApp, dest: buildDir, name: name};
  formattedOptions.css = {app: cssApp, dest: buildDir, name: name};
  formattedOptions.html = {src: htmlSrc, dest: buildDir, name: name};

  return formattedOptions;
};
