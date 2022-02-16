




var extname = require('path').extname,
mime = require('connect/utils').mime,
http = require('http'),
fs = require('fs');



var engines = {};



var cache = { views: {}, partials: {} };



var helpers = exports.helpers = {};



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
options.locals.firstInCollection = i === 0;
options.locals.indexInCollection = i;
options.locals.lastInCollection = i === len - 1;
