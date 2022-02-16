




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
options.locals = options.locals || {};
options.locals.collectionLength = len;
return collection.map(function(val, i){
options[name] = val;
options.locals.firstInCollection = i === 0;
options.locals.indexInCollection = i;
options.locals.lastInCollection = i === len - 1;
return this.render(view, options);
}, this).join('');
} else {
return this.render(view, options);
}
};



http.ServerResponse.prototype.render = function(view, options, fn){
options = options || {};


var self = this,
root = options.root || this.app.set('views') || process.cwd() + '/views',
path = root + '/' + view,
ext = extname(view),
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


function send(str) {
self.writeHead(200, {
'Content-Type': 'text/html',
'Content-Length': str.length
});
self.end(str);
}


options.filename = path;


fs.readFile(path, 'utf8', function(err, str){

var engine = cache[ext] || (cache[ext] = require(ext.substr(1)));
str = engine.render(str, options);
if (layout) {
options.locals = options.locals || {};
options.layout = false;
options.locals.body = str;
self.render(layout, options);
} else if (fn) {
fn(null, str);
} else {
send(str);
}
});
};
