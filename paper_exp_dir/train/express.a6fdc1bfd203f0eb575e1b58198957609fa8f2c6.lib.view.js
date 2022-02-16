




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



var cache = {};



exports = module.exports = View;



exports.register = View.register;



function renderPartial(res, view, options, parentLocals, parent){
var collection, object, locals;


if (parent && !~view.indexOf('.')) {
view += parent.extension;
}

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


options.renderPartial = true;
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
return res.render(view, options, null, parent);
}


if (collection) {
var len = collection.length
, buf = '';
options.collectionLength = len;
for (var i = 0; i < len; ++i) {
var val = collection[i];
options.firstInCollection = i === 0;
options.indexInCollection = i;
options.lastInCollection = i === len - 1;
object = val;
buf += render();
}
return buf;
} else {
return render();
}
};



res.partial = function(view, options){
var app = this.app
, options = options || {}
, parent = {};


parent.dirname = app.set('views') || process.cwd() + '/views';


if (app.set('view engine')) {
parent.extension = '.' + app.set('view engine');
}

var str = renderPartial(this, view, options, null, parent);
this.send(str);
};



res.render = function(view, opts, fn, parent){

if (typeof opts === 'function') {
fn = opts, opts = null;
}

var options = {}
, self = this
, app = this.app
, helpers = app.viewHelpers
, dynamicHelpers = app.dynamicViewHelpers
, viewOptions = app.set('view options')
, cacheTemplates = app.set('cache views');


if (viewOptions) merge(options, viewOptions);


if (this.locals) merge(options, this.locals);


if (opts) merge(options, opts);


if (opts && opts.locals) merge(options, opts.locals);


if (options.status) this.statusCode = options.status;


var self = this
, root = app.set('views') || process.cwd() + '/views'
, partial = options.renderPartial
, layout = options.layout;


if (true === layout || undefined === layout) {
layout = 'layout';
}


options.scope = options.scope || {};


options.parentView = parent;


options.root = root;


options.defaultEngine = app.set('view engine');


if (options.charset) this.charset = options.charset;


var orig = view = new View(view, options);


if (!view.exists) view = new View(orig.prefixPath, options);


if (!view.exists) view = new View(orig.indexPath, options);


if (!view.exists && !options.isLayout) view = new View(orig.upIndexPath, options);


if (!view.exists && options.isLayout) view = new View(orig.rootPath, options);


if (!view.exists) {
if (app.enabled('hints')) hintAtViewPaths(orig, options);
throw new Error('failed to locate view "' + orig.view + '"');
}


if (false !== options.dynamicHelpers) {

if (!this.__dynamicHelpers) {
this.__dynamicHelpers = {};
for (var key in dynamicHelpers) {
this.__dynamicHelpers[key] = dynamicHelpers[key].call(
this.app
, this.req
, this);
}
}


merge(options, this.__dynamicHelpers);
}


union(options, helpers);


options.partial = function(path, opts){
return renderPartial(self, path, opts, options, view);
};


options.filename = view.path;

function error(err) {
if (fn) {
fn(err);
} else {
self.req.next(err);
}
}
