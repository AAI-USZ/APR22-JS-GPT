




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
return this.render(view, options);
}
};



http.ServerResponse.prototype.render = function(view, options, fn){
options = options || {};
var defaultEngine = this.app.set('view engine');


if (view.indexOf('.') < 0 && defaultEngine) {
view += '.' + defaultEngine;
}


var self = this,
root = viewRoot(this.app),
ext = extname(view),
partial = options.partial,
layout = options.layout === undefined ? true : options.layout,
layout = layout === true
? 'layout' + ext
: layout;


if (this.app.set('env') === 'production') {
options.cache = true;
}


if (options.partial) {
root += '/partials';
}


var path = root + '/' + view;


function send(str) {
self.writeHead(200, {
'Content-Type': 'text/html',
'Content-Length': str.length
});
self.end(str);
}


options.locals = options.locals || {};
options.locals.__filename = options.filename = path;


options.locals.partial = function(view, options){
return self.partial.call(self, view, options, ext);
};


options.locals.__proto__ = helpers;

function error(err) {
if (fn) {
fn(err);
} else {
throw err;
}
}


try {
var str = viewCache[path] || cacheViewSync(path);
} catch (err) {
return error(err);
}


var engine = cache[ext] || (cache[ext] = require(ext.substr(1)));


try {
var str = engine.render(str, options);
} catch (err) {
return error(err);
}


if (layout) {
options.layout = false;
options.locals.body = str;
self.render(layout, options);
} else if (partial) {
return str;
} else if (fn) {
fn(null, str);
} else {
send(str);
}
};
