




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
options.locals = options.locals || {};
options.partial = true;
options.layout = false;


var collection = options.collection;
if (collection) {
var name = options.as || view.split('.')[0],
len = collection.length;
delete options.collection;
options.locals.collectionLength = len;
return collection.map(function(val, i){
options.locals.firstInCollection = i === 0;
options.locals.indexInCollection = i;
options.locals.lastInCollection = i === len - 1;
options.object = val;
return this.partial(view, options);
}, this).join('');
} else {
if (options.object) {
var name = options.as || view.split('.')[0];
if (typeof name === 'string') {
options.locals[name] = options.object;
} else if (name === global) {
utils.merge(options.locals, options.object);
} else {
options.context = options.object;
}
}
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
helpers = this.app.viewHelpers,
dynamicHelpers = this.app.dynamicViewHelpers,
root = viewRoot(this.app),
ext = extname(view),
partial = options.partial,
layout = options.layout === undefined ? true : options.layout,
layout = layout === true
? 'layout' + ext
: layout;


if (typeof layout === 'string' && layout.indexOf('.') < 0) {
layout += ext;
}


options.scope = (options.scope || options.context) || this;


if (this.app.set('env') === 'production') {
options.cache = true;
}


if (options.partial) {
root += '/partials';
}


var path = root + '/' + view;


options.locals = options.locals || {};
options.locals.__filename = options.filename = path;


var keys = Object.keys(dynamicHelpers);
for (var i = 0, len = keys.length; i < len; ++i) {
var key = keys[i],
val = dynamicHelpers[key];
if (typeof val === 'function') {
helpers[key] = val.call(this.app, this.req, this, this.req.params.path);
}
}


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
self.send(str);
}
};
