




var path = require('path')
, extname = path.extname
, dirname = path.dirname
, basename = path.basename
, utils = require('connect').utils
, View = require('./view/view')
, partial = require('./view/partial')
, union = require('./utils').union
, merge = utils.merge
, http = require('http')
, res = http.ServerResponse.prototype;



exports = module.exports = View;



exports.register = View.register;



exports.compile = function(view, cache, cid, options){
if (cache && cid && cache[cid]) return cache[cid];


view = exports.lookup(view, options);


if (!view.exists) {
if (options.hint) hintAtViewPaths(view.original, options);
var err = new Error('failed to locate view "' + view.original.view + '"');
err.view = view.original;
throw err;
}


options.filename = view.path;
view.fn = view.templateEngine.compile(view.contents, options);
cache[cid] = view;

return view;
};



exports.lookup = function(view, options){
var orig = view = new View(view, options)
, partial = options.isPartial
, layout = options.isLayout;



if (partial) {
view = new View(orig.prefixPath, options);
if (!view.exists) view = orig;
}


if (!layout && !view.exists) view = new View(orig.indexPath, options);



if (!layout && !view.exists) view = new View(orig.upIndexPath, options);


if (!view.exists) view = new View(orig.rootPath, options);


if (!view.exists && partial) view = new View(view.prefixPath, options);

view.original = orig;
return view;
};



function renderPartial(res, view, options, parentLocals, parent){
var collection, object, locals;

if (options) {

if (options.collection) {
collection = options.collection;
delete options.collection;
} else if ('length' in options) {
collection = options;
options = {};
}


if (options.locals) {
locals = options.locals;
delete options.locals;
}


if ('Object' != options.constructor.name) {
object = options;
options = {};
} else if (undefined != options.object) {
object = options.object;
delete options.object;
}
} else {
options = {};
}


union(options, parentLocals);


if (locals) merge(options, locals);


options.isPartial = true;
options.layout = false;


var name = options.as || partial.resolveObjectName(view);


function render(){
if (object) {
if ('string' == typeof name) {
options[name] = object;
} else if (name === global) {
merge(options, object);
} else {
options.scope = object;
}
}
return res.render(view, options, null, parent, true);
}


if (collection) {
var len = collection.length
, buf = ''
, keys
, key
, val;

options.collectionLength = len;

if ('number' == typeof len || Array.isArray(collection)) {
for (var i = 0; i < len; ++i) {
val = collection[i];
options.firstInCollection = i == 0;
options.indexInCollection = i;
options.lastInCollection = i == len - 1;
object = val;
buf += render();
}
} else {
keys = Object.keys(collection);
len = keys.length;
options.collectionLength = len;
options.collectionKeys = keys;
for (var i = 0; i < len; ++i) {
key = keys[i];
val = collection[key];
options.keyInCollection = key;
options.firstInCollection = i == 0;
options.indexInCollection = i;
options.lastInCollection = i == len - 1;
object = val;
buf += render();
}
}

return buf;
} else {
return render();
}
};



res.partial = function(view, options, fn){
var app = this.app
, options = options || {}
, viewEngine = app.set('view engine')
, parent = {};


if ('function' == typeof options) {
fn = options;
options = {};
}


parent.dirname = app.set('views') || process.cwd() + '/views';


if (viewEngine) parent.engine = viewEngine;


try {
var str = renderPartial(this, view, options, null, parent);
} catch (err) {
if (fn) {
fn(err);
} else {
this.req.next(err);
}
return;
}


if (fn) {
fn(null, str);
} else {
this.send(str);
}
};



res.render = function(view, opts, fn, parent, sub){

if ('function' == typeof opts) {
fn = opts, opts = null;
}

try {
return this._render(view, opts, fn, parent, sub);
} catch (err) {

if (fn) {
fn(err);

} else if (sub) {
throw err;

} else {
this.req.next(err);
}
}
};



res._render = function(view, opts, fn, parent, sub){
var options = {}
, self = this
, app = this.app
, locals = app._locals
, dynamic = app._dynamicLocals
, root = app.set('views') || process.cwd() + '/views';


var cid = app.enabled('view cache')
? view + (parent ? ':' + parent.path : '')
: false;


merge(options, this.locals);


if (opts) merge(options, opts);


if (opts && opts.locals) merge(options, opts.locals);


if (options.status) this.statusCode = options.status;


options.attempts = [];

var partial = options.isPartial
, layout = options.layout;


if (true === layout || undefined === layout) {
layout = 'layout';
}


options.scope = options.scope || {};


options.parentView = parent;


options.root = root;


options.defaultEngine = app.set('view engine');


if (options.charset) this.charset = options.charset;


if (false !== options.dynamic) {

if (!this.__dynamic) {
this.__dynamic = {};
for (var key in dynamic) {
this.__dynamic[key] = dynamic[key].call(
this.app
, this.req
, this);
}
}


merge(options, this.__dynamic);
}


union(options, locals);


options.partial = function(path, opts){
return renderPartial(self, path, opts, options, view);
};


options.hint = app.enabled('hints');
view = exports.compile(view, app.cache, cid, options);


options.layout = function(path){
layout = path;
};


var str = view.fn.call(options.scope, options);


if (layout) {
options.isLayout = true;
options.layout = false;
options.body = str;
this.render(layout, options, fn, view, true);

} else if (partial) {
return str;


} else if (fn) {
fn(null, str);

} else {
this.send(str);
}
}



function hintAtViewPaths(view, options) {
console.error();
console.error('failed to locate view "' + view.view + '", tried:');
options.attempts.forEach(function(path){
console.error('  - %s', path);
});
console.error();
}
