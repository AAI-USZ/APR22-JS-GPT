var async = require('async'),
fs = require('graceful-fs'),
_ = require('lodash'),
pathFn = require('path'),
util = require('../../../util'),
file = util.file2,
Pool = util.pool,
HexoError = require('../../../error');

module.exports = function(args, callback){
var watchOption = args.w || args.watch,
start = Date.now(),
cache = {},
count = 0;

var log = hexo.log,
config = hexo.config,
route = hexo.route,
publicDir = hexo.public_dir,
sourceDir = hexo.source_dir;

if (config.multi_thread){
var workerPath = require.resolve('./worker');

if (config.multi_thread === true){
var q = new Pool(workerPath);
} else {
var q = new Pool(workerPath, config.multi_thread);
}
} else {
var q = async.queue(function(data, next){
if (data.type === 'copy'){
file.copyFile(data.src, data.dest, next);
} else {
file.writeFile(data.dest, data.content, next);
}
}, config.max_open_file);
}

var pushCallback = function(err){
var data = this.data,
path = data.dest.substring(publicDir.length);

if (err){
if (err.code === 'EMFILE'){
q.push(item, pushCallback);
} else {
callback(HexoError.wrap(err, 'File generate failed: ' + path));
}

return;
}

count++;
log.log('create', 'Public: %s', path);
};



hexo.emit('generateBefore');

hexo.post.load({watch: watchOption}, function(err){
if (err) return callback(err);

var list = route.routes,
keys = Object.keys(list),
finish = Date.now(),
elapsed = (finish - start) / 1000;
