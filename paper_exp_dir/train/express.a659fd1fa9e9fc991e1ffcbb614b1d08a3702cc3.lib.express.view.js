




var extname = require('path').extname,
mime = require('connect/utils').mime,
utils = require('connect/utils'),
http = require('http'),
fs = require('fs');



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


var collection = options.collection;
if (collection) {
var name = options.as || view.split('.')[0],
len = collection.length,
buf = '';
delete options.collection;
options.locals.collectionLength = len;
for (var i = 0, len = collection.length; i < len; ++i) {
var val = collection[i];
options.locals.firstInCollection = i === 0;
options.locals.indexInCollection = i;
options.locals.lastInCollection = i === len - 1;
