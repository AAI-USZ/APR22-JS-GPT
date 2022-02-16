




var extname = require('path').extname,
mime = require('connect/utils').mime,
http = require('http'),
fs = require('fs');



var engines = {};







http.ServerResponse.prototype.partial = function(view, options){
options = options || {};
options.partial = true;
options.layout = false;
var collection = options.collection;
if (collection) {
var name = options.as || view.split('.')[0],
len = collection.length;
options.locals = options.locals || {};
