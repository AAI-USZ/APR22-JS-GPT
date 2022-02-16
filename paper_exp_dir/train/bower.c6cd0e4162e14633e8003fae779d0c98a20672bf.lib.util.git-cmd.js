











var path   = require('path');
var spawn  = require('./spawn');
var rimraf = require('rimraf');
var config = require('../core/config');

module.exports = function (args, options, emitter) {
process.env.GIT_TEMPLATE_DIR = config.git_template;
var cp = spawn('git', args, options, emitter);
var cwd = options ? options.cwd || process.cwd() : process.cwd();
var isTmp = path.normalize(cwd).indexOf(config.cache) === 0;

cp.on('exit', function (code) {
if (code === 128 && isTmp) rimraf.sync(cwd);
});

return cp;
