var fs = require('fs'),
async = require('async'),
colors = require('colors'),
path = require('path'),
moment = require('moment'),
util = require('../../util'),
file = util.file2,
yfm = util.yfm;

module.exports = function(args, callback) {
var filename = args._[0] || false;

if (!filename) {
hexo.call('help', {_: ['publish']}, callback);
return;
}

var sourceDir = hexo.source_dir,
src = path.join(sourceDir, '_drafts', filename + '.md'),
dest = path.join(sourceDir, '_posts', filename + '.md');
