




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
if (options.collection) {
var name = options.as || view.split('.')[0].
len = options.collection.length;
options.locals = options.locals || {};
options.locals.__length__ = len;
return options.collection.map(function(val, i){
options.locals.__isFirst = i === 0;
options.locals.__index = i;
options.locals.__n = i + 1;
options.locals.__isLast = i === len - 1;
return this.render(view, options);
}, this);
} else {
this.render(view, options);
}
};



http.ServerResponse.prototype.render = function(view, options, fn){
options = options || {};

if (options.layout === undefined) {
options.layout = true;
}


var self = this,
root = options.root || this.app.set('views') || process.cwd() + '/views',
path = root + '/' + view,
ext = extname(view),
