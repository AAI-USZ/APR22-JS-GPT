




var extname = require('path').extname
, dirname = require('path').dirname
, basename = require('path').basename
, utils = require('connect').utils
, clone = require('./utils').clone
, merge = utils.merge
, http = require('http')
, fs = require('fs')
, mime = utils.mime;



var cache = {};



var viewCache = {};



var viewNameCache = {};



var View = exports = module.exports = function View(view, options) {
options = options || {};

this.view = view;
this.root = options.root;
this.defaultEngine = options.defaultEngine;
this.parent = options.parentView;
this.basename = basename(view);
this.engine = this.resolveEngine();
this.extension = '.' + this.engine;
this.path = this.resolvePath();
this.dirname = dirname(this.path);
};



View.prototype.resolveEngine = function(){

if (~this.basename.indexOf('.')) return extname(this.basename).substr(1);

if (this.parent) return this.parent.engine;

return this.defaultEngine;
};



View.prototype.resolvePath = function(){
var path = this.view;

if (!~this.basename.indexOf('.')) path += this.extension;

if ('/' == path[0]) return path;

if (this.parent) return this.parent.dirname + '/' + path;

return this.root
? this.root + '/' + path
: path;
};



View.prototype.__defineGetter__('contents', function(){
return fs.readFileSync(this.path, 'utf8');
});



View.prototype.__defineGetter__('templateEngine', function(){
var ext = this.extension;
return cache[ext]
|| (cache[ext] = require(this.engine));
});



var Partial = exports.Partial = function Partial(view, options) {
options = options || {};
View.call(this, view, options);
this.objectName = options.as || this.resolveObjectName();
this.path = this.dirname + '/_' + basename(this.path);
};



Partial.prototype.__proto__ = View.prototype;



Partial.prototype.resolveObjectName = function(){

return this.view
.split('/')
.slice(-1)[0]
.split('.')[0]
.replace(/[^a-zA-Z0-9 ]+/g, ' ')
.split(/ +/).map(function(word, i){
return i
? word[0].toUpperCase() + word.substr(1)
: word;
}).join('');
};



function cacheViewSync(path) {
return viewCache[path] = fs.readFileSync(path, 'utf8');
}



function viewRoot(app) {
return app.set('views') || process.cwd() + '/views';
}



function objectName(view) {
return view.split('/').slice(-1)[0].split('.')[0];
}



exports.register = function(ext, exports) {
cache[ext] = exports;
};



http.ServerResponse.prototype.partial = function(view, options, locals, parent){
locals = locals || {};


if (parent && !~view.indexOf('.')) {
view += parent.extension;
}


if (options) {
if ('length' in options) {
options = { collection: options };
} else if (!options.collection && !options.locals && !options.object) {
options = { object: options };
}
} else {
options = {};
}


options.locals = options.locals
? merge(locals, options.locals)
: locals;


options.renderPartial = true;
options.layout = false;


var name = options.as
|| viewNameCache[view]
|| (viewNameCache[view] = objectName(view));


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
merge(options.locals, options.object);
} else {
options.scope = options.object;
}
}
return this.render(view, options);
}
};



http.ServerResponse.prototype.render = function(view, options, fn, parent){

if (typeof options === 'function') {
fn = options, options = {};
}

var self = this
, app = this.app
, options = options || {}
, helpers = app.viewHelpers
, dynamicHelpers = app.dynamicViewHelpers
, viewOptions = app.settings['view options'];


if (viewOptions) options.__proto__ = viewOptions;


var self = this
, root = viewRoot(this.app)
, partial = options.renderPartial
, layout = options.layout;


if (true === layout || undefined === layout) {
layout = 'layout';
}


options.scope = options.scope || this.req;


var locals = options.locals = options.locals || {};


options.parentView = parent;


options.root = app.settings.views || process.cwd() + '/views';


options.defaultEngine = app.settings['view engine'];


view = partial
? new Partial(view, options)
: new View(view, options);


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


merge(options.locals, this.__dynamicHelpers);
}


options.locals = merge(clone(helpers), options.locals);


options.locals.partial = function(path, options){
return self.partial(path, options, locals, view);
};

function error(err) {
if (fn) {
fn(err);
} else {
self.req.next(err);
}
}


try {
var template = view.templateEngine.compile(view.contents, options);
str = template.call(options.scope, options.locals);
} catch (err) {
return error(err);
}


if (layout) {
options.layout = false;
options.locals.body = str;
self.render(layout, options, fn, view);
} else if (partial) {
return str;
} else if (fn) {
fn(null, str);
} else {
this.send(str, options.headers, options.status);
}
};
