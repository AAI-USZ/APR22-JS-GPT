var path = require('path'),
fs = require('graceful-fs'),
_ = require('lodash'),
util = require('../../util'),
file = util.file2;

if (!fs.exists || !fs.existsSync){
fs.exists = path.exists;
fs.existsSync = path.existsSync;
}

var cache = {};

var render = function(src, options){
if (options.cache && cache.hasOwnProperty(src)){
var content = cache[src];
} else {
try {
var content = file.readFileSync(src);
if (options.cache) cache[src] = content;
} catch (err){
throw err;
}
