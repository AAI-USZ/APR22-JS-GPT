




var extname = require('path').extname,
mime = require('connect/utils').mime,
utils = require('connect/utils'),
http = require('http'),
sys = require('sys'),
fs = require('fs');



var cache = {};



var viewCache = {};



exports.clearCache = function(){
viewCache = {};
};



var helpers = exports.helpers = {};



function cacheView(path) {
fs.readFile(path, 'utf8', function(err, data){
if (!err) {
viewCache[path] = data;
}
});
}



function cacheViewSync(path) {
return viewCache[path] = fs.readFileSync(path, 'utf8');
}



function viewRoot(app) {
return app.set('views') || process.cwd() + '/views';
}



exports.watcher = function(interval){
interval = interval === true
? 300000
: interval;
(function cache(dir){
fs.readdir(dir, function(err, files){
if (!err) {
files.forEach(function(file){
file = dir + '/' + file;
fs.stat(file, function(err, stats){
if (!err) {
if (stats.isFile()) {
fs.watchFile(file, { interval: interval }, function(curr, prev){
if (curr.mtime > prev.mtime) {
cacheView(file);
}
});
} else if (stats.isDirectory()) {
cache(file);
}
}
});
});
}
});
})(viewRoot(this));
};



http.ServerResponse.prototype.partial = function(view, options, ext){
if (ext && view.indexOf('.') < 0) {
view += ext;
}
if (options instanceof Array) {
options = { collection: options };
}
options = options || {};
options.partial = true;
options.layout = false;
var collection = options.collection;
if (collection) {
var name = options.as || view.split('.')[0],
len = collection.length;
var locals = options.locals = options.locals || {};
locals.collectionLength = len;
return collection.map(function(val, i){
if (typeof name === 'string') {
locals[name] = val;
} else if (name === global) {
utils.merge(locals, val);
} else {
options.context = val;
}
locals.firstInCollection = i === 0;
locals.indexInCollection = i;
locals.lastInCollection = i === len - 1;
return this.render(view, options);
}, this).join('');
} else {
options.locals = options.locals || {};
if (options.object) {
var name = options.as || view.split('.')[0];
if (typeof name === 'string') {
options.locals[name] = options.object;
} else if (name === global) {
utils.merge(options.locals, options.object);
} else {
options.context = options.object;
}
