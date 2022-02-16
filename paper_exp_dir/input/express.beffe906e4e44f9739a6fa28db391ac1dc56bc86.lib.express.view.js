




var extname = require('path').extname,
mime = require('connect/utils').mime,
utils = require('connect/utils'),
http = require('http'),
fs = require('fs');



var cache = {};



var viewCache = {};



exports.clearCache = function(){
viewCache = {};
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


var self = this,
ext = extname(view),
partial = options.partial,
root = options.root || this.app.set('views') || process.cwd() + '/views',
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

function error(err) {
if (fn) {
fn(err);
} else {
throw err;
}
}


try {
var str = viewCache[path] || (viewCache[path] = fs.readFileSync(path, 'utf8'));
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
