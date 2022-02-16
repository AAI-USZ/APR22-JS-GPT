




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


if (options && options.hasOwnProperty('length')) {
options = { collection: options };
}


options = options || {};


options.locals = options.locals || {};
utils.merge(options.locals, locals);


options.partial = true;
options.layout = false;


var name = options.as || view.split('/').slice(-1)[0].split('.')[0];
