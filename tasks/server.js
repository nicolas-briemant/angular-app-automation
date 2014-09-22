var express = require('express')
  , livereload = require('connect-livereload')
  , lr = require('tiny-lr')()
  , gulp = require('gulp')
  , util = require('gulp-util');

module.exports = function server(options, cb) {
  options = options || {};
  options.port = options.port || 5000;
  options.lrport = options.lrport || 5001;
  if (!options.src) throw new util.PluginError('Server', 'src is required.');

  var server = express();

  server.use(livereload({ port: options.lrport }));
  server.use(express.static(options.src));

  server.listen(options.port);
  util.log(util.colors.green('Express serving ' + options.src + ' on ' + options.port))

  lr.listen(options.lrport, function(err) {
    if (err) return cb(err);
    util.log(util.colors.green('Watching ' + options.src + ' on ' + options.lrport))
  });

  cb(null, notifier);

  function notifier(event) {
    util.log(util.colors.gray('Livereloading ' + event.path));
    lr.changed({ body: { files: [event.path] } });
  }
}