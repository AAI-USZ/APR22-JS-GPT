




var extname = require('path').extname,
mime = require('connect/utils').mime,
utils = require('connect/utils'),
http = require('http'),
sys = require('sys'),
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
