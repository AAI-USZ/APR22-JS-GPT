




var extname = require('path').extname,
mime = require('connect/utils').mime,
http = require('http'),
fs = require('fs');



var cache = {};



var viewCache = {};



exports.clearCache = function(){
viewCache = {};
};



http.ServerResponse.prototype.partial = function(view, options){
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
} else {
options.context = val;
}
locals.firstInCollection = i === 0;
locals.indexInCollection = i;
locals.lastInCollection = i === len - 1;
return this.render(view, options);
}, this).join('');
