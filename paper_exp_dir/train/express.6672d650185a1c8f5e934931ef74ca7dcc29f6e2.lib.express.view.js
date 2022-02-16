




var extname = require('path').extname
, utils = require('connect').utils
, http = require('http')
, fs = require('fs')
, mime = utils.mime;



var cache = {};



var viewCache = {};



function cacheViewSync(path) {
return viewCache[path] = fs.readFileSync(path, 'utf8');
}



function viewRoot(app) {
return app.set('views') || process.cwd() + '/views';
}



exports.register = function(ext, exports) {
cache[ext] = exports;
};



http.ServerResponse.prototype.partial = function(view, options, ext){

if (ext && view.indexOf('.') < 0) {
view += ext;
}


if (options && options.hasOwnProperty('length')) {
options = { collection: options };
}


options = options || {};
options.locals = options.locals || {};
options.partial = true;
options.layout = false;
var name = options.as || view.split('/').slice(-1)[0].split('.')[0];


var collection = options.collection;
if (collection) {
var len = collection.length
, buf = '';
delete options.collection;
options.locals.collectionLength = len;
for (var i = 0; i < len; ++i) {
var val = collection[i];
options.locals.firstInCollection = i === 0;
options.locals.indexInCollection = i;
options.locals.lastInCollection = i === len - 1;
options.object = val;
buf += this.partial(view, options);
}
return buf;
} else {
if (options.object) {
if ('string' == typeof name) {
options.locals[name] = options.object;
} else if (name === global) {
utils.merge(options.locals, options.object);
