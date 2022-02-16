




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



function cacheViewSync(path) {
return viewCache[path] = fs.readFileSync(path, 'utf8');
}



function viewRoot(app) {
return app.set('views') || process.cwd() + '/views';
}



http.ServerResponse.prototype.partial = function(view, options, ext){

if (ext && view.indexOf('.') < 0) {
view += ext;
}


if (Array.isArray(options)) {
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


options.scope = options.scope || options.context || this;


if (this.app.set('env') === 'production') {
options.cache = true;
}


if (options.partial) {
root = this.app.set('partials')
? this.app.set('partials')
: root + '/partials';
}


var path = view[0] === '/'
? view
: root + '/' + view;

