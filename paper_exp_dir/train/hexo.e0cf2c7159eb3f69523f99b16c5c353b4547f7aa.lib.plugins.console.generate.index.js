var async = require('async'),
fs = require('graceful-fs'),
_ = require('lodash'),
pathFn = require('path'),
util = require('../../../util'),
file = util.file2,
Pool = util.pool,
HexoError = require('../../../error');

var log = hexo.log,
config = hexo.config,
route = hexo.route,
publicDir = hexo.public_dir,
sourceDir = hexo.source_dir;

module.exports = function(args, callback){
var watchOption = args.w || args.watch,
start = Date.now(),
cache = {},
count = 0;

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

log.i('Files loaded in %ss', elapsed.toFixed(3));

async.auto({

exist: function(next){
fs.exists(publicDir, function(exist){
next(null, exist);
});
},

clear: ['exist', function(next, results){
if (!results.exist){
log.d('Public folder not exists. No need to clear public folder.');
return next();
}

var exclude = _.map(keys, function(item){
return pathFn.normalize(item);
});

file.emptyDir(publicDir, {exclude: exclude}, function(err){
if (err) return callback(HexoError.wrap(err, 'Public folder clear failed'));

log.d('Public folder cleared:', exclude.join(','));
next();
})
}],

generate: ['exist', function(next, results){
var exist = results.exist,
arr = [];

start = Date.now();

async.forEach(keys, function(i, next){
var item = list[i],
dest = pathFn.join(publicDir, i);

async.waterfall([
function(next){
if (!exist || item.modified) return next(null, true);

fs.exists(dest, function(exist){
next(null, !exist);
});
},
function(push, next){
if (!push) return next();

item(function(err, result){
if (err) return callback(HexoError.wrap(err, 'Render failed: ' + i));
if (result == null) return next();

if (result.readable){
arr.push({
type: 'copy',
src: result.path,
dest: dest
});
} else {
cache[i] = result;
