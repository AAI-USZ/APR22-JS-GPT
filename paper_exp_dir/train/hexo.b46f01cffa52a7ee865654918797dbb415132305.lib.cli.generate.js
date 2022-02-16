var extend = require('../extend'),
route = require('../route'),
util = require('../util'),
file = util.file,
inherits = require('util').inherits,
async = require('async'),
colors = require('colors'),
fs = require('fs'),
_ = require('underscore'),
publicDir = hexo.public_dir,
cache = {};

var process = function(cache, callback){
var list = route.list(),
keys = Object.keys(list),
generate = require('../generate');

console.log('Generating.');

async.parallel([
function(next){
fs.exists(publicDir, function(exist){
if (!exist) return next();
file.empty(publicDir, keys.concat(cache), next);
});
},
function(next){
var queue = async.queue(function(key, next){
list[key](function(err, result){
if (err) throw new Error('Generate Error: ' + key);

if (result.readable){
if (hexo.debug) console.log('Copying %s', result.path.bold);
file.copy(result.path, publicDir + result.source, next);
} else {
if (cache[key] !== result){
cache[key] = result;
if (hexo.debug) console.log('Writing %s', (publicDir + key).bold);
file.write(publicDir + key, result, next);
} else {
next();
}
}
});
}, 512);

queue.push(keys, function(err){
if (err) throw err;
});

queue.drain = callback;
}
]);
};

extend.console.register('generate', 'Generate static files', function(args){
var ignoreTheme = args.t || args.theme ? true : false,

watch = false,
start = new Date(),
generate = require('../generate'),
watchFn = require('../watch');

console.log('Loading.');
hexo.emit('generateBefore');

generate({ignore: ignoreTheme}, function(err, cache){
