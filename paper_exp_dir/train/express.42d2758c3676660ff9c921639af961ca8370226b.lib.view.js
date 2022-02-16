




var path = require('path')
, extname = path.extname
, dirname = path.dirname
, basename = path.basename
, utils = require('connect').utils
, View = require('./view/view')
, Partial = require('./view/partial')
, union = require('./utils').union
, merge = utils.merge
, http = require('http');



var cache = {};



exports = module.exports = View;
exports.Partial = Partial;



exports.register = View.register;



http.ServerResponse.prototype.partial = function(view, options, locals, parent){
var self = this;


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


merge(options, locals);


if (options.locals) {
merge(options, options.locals);
}


options.renderPartial = true;
options.layout = false;


var name = options.as || Partial.resolveObjectName(view);


function render(){
if (options.object) {
if ('string' == typeof name) {
options[name] = options.object;
} else if (name === global) {
merge(options, options.object);
} else {
options.scope = options.object;
}
}
return self.render(view, options, null, parent);
}


var collection = options.collection;
if (collection) {
var len = collection.length
, buf = '';
delete options.collection;
options.collectionLength = len;
for (var i = 0; i < len; ++i) {
var val = collection[i];
options.firstInCollection = i === 0;
options.indexInCollection = i;
options.lastInCollection = i === len - 1;
options.object = val;
buf += render();
}
return buf;
} else {
return render();
}
};



http.ServerResponse.prototype.render = function(view, opts, fn, parent){

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


var self = this
, root = app.set('views') || process.cwd() + '/views'
, partial = options.renderPartial
, layout = options.layout;


if (true === layout || undefined === layout) {
layout = 'layout';
}


options.scope = options.scope || this.req;


options.parentView = parent;


options.root = root;


options.defaultEngine = app.set('view engine');



var orig = view = partial
? new Partial(view, options)
: new View(view, options);


if (!view.exists) {
view = partial
? new Partial(view.prefixPath, options)
: new View(view.prefixPath, options);
}


if (!view.exists) {
view = partial
? new Partial(orig.indexPath, options)
: new View(orig.indexPath, options);
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
return self.partial(path, opts, options, view);
};

function error(err) {
if (fn) {
fn(err);
} else {
self.req.next(err);
}
}


try {
var engine = view.templateEngine
, template = cacheTemplates
? cache[view.path] || (cache[view.path] = engine.compile(view.contents, options))
: engine.compile(view.contents, options)
, str = template.call(options.scope, options);
} catch (err) {
return error(err);
}


if (layout) {
options.isLayout = true;
options.layout = false;
options.body = str;
options.relative = false;
self.render(layout, options, fn, view);
} else if (partial) {
return str;
} else if (fn) {
fn(null, str);
} else {
this.send(str, options.headers, options.status);
}
};
