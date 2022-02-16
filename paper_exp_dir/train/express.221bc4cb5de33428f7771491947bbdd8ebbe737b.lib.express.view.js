




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



http.ServerResponse.prototype.partial = function(view, options, ext, locals){

if (ext && view.indexOf('.') < 0) {
view += ext;
}


if (options) {
if (options.hasOwnProperty('length')) {
options = { collection: options };
}
} else {
options = {};
}


options.locals = options.locals || {};
utils.merge(options.locals, locals);
