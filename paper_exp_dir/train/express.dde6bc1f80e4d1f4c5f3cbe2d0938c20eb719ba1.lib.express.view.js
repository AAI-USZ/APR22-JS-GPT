




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
} else {
options.scope = options.object;
}
}
return this.render(view, options);
}
};



http.ServerResponse.prototype.render = function(view, options, fn){

if (typeof options === 'function') {
fn = options, options = {};
}

var options = options || {}
, app = this.app
, viewOptions = app.settings['view options']
, defaultEngine = app.settings['view engine'];


if (viewOptions) options.__proto__ = viewOptions;


if (view.indexOf('.') < 0 && defaultEngine) {
view += '.' + defaultEngine;
}


var self = this
, helpers = this.app.viewHelpers
, dynamicHelpers = this.app.dynamicViewHelpers
, root = viewRoot(this.app)
, ext = extname(view)
, partial = options.partial
, layout = options.layout === undefined ? true : options.layout
, layout = layout === true
? 'layout' + ext
: layout;


if (typeof layout === 'string' && layout.indexOf('.') < 0) {
layout += ext;
}


options.scope = options.scope || this.req;


if (this.app.set('env') === 'production') {
options.cache = true;
}


if (options.partial) {
root = app.settings.partials || root + '/partials';
}


var path = view[0] === '/'
? view
: root + '/' + view;


var locals = options.locals = options.locals || {};
options.locals.__filename = options.filename = path;


if (false !== options.dynamicHelpers) {

if (!this.__dynamicHelpers) {
this.__dynamicHelpers = {};
var keys = Object.keys(dynamicHelpers);
for (var i = 0, len = keys.length; i < len; ++i) {
var key = keys[i]
, val = dynamicHelpers[key];
if (typeof val === 'function') {
this.__dynamicHelpers[key] = val.call(
this.app
, this.req
, this);
}
}
}


helpers.__proto__ = this.__dynamicHelpers;
}


options.locals.__proto__ = helpers;


options.locals.partial = function(view, options){
return self.partial.call(self, view, options, ext, locals);
};

function error(err) {
if (fn) {
fn(err);
} else {
self.req.next(err);
}
}


try {
var str = (options.cache ? viewCache[path] : null) || cacheViewSync(path);
} catch (err) {
return error(err);
}


var engine = cache[ext] || (cache[ext] = require(ext.substr(1)));


try {
var str = engine.render(str, options);
} catch (err) {
return error(err);
}


if (layout) {
options.layout = false;
options.locals.body = str;
options.isLayout = true;
self.render(layout, options, fn);
} else if (partial) {
return str;
} else if (fn) {
fn(null, str);
} else {
this.send(str, options.headers, options.status);
}
};
