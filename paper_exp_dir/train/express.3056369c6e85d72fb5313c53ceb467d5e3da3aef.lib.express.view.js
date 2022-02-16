




var extname = require('path').extname,
mime = require('connect/utils').mime,
http = require('http'),
fs = require('fs');



var cache = {};







http.ServerResponse.prototype.partial = function(view, options){
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
locals[name] = val;
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


options.locals = options.locals || {};
options.locals.partial = function(){
self.partial.apply(self, arguments);
};


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


options.filename = path;

function error(err) {
if (fn) {
fn(err);
} else {
throw err;
}
}


fs.readFile(path, 'utf8', function(err, str){
if (err) {
error(err);
} else {
var engine = cache[ext] || (cache[ext] = require(ext.substr(1)));
try {
str = engine.render(str, options);
} catch (err) {
error(err);
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
}
});
};
