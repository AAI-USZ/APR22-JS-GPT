




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


var name = options.as
|| viewNameCache[view]
|| (viewNameCache[view] = objectName(view));


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
buf += this.partial(view, options);
}
return buf;
} else {
if (options.object) {
if ('string' == typeof name) {
options[name] = options.object;
} else if (name === global) {
merge(options, options.object);
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


if (viewOptions) options = merge(clone(viewOptions), options);


var self = this
, root = viewRoot(this.app)
, partial = options.renderPartial
, layout = options.layout;


if (true === layout || undefined === layout) {
layout = 'layout';
}


options.scope = options.scope || this.req;


options.parentView = parent;


options.root = app.settings.views || process.cwd() + '/views';


options.defaultEngine = app.settings['view engine'];


view = partial
? new Partial(view, options)
: new View(view, options);


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


options = merge(clone(helpers), options);


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
var template = view.templateEngine.compile(view.contents, options);
str = template.call(options.scope, options);
} catch (err) {
return error(err);
}


if (layout) {
options.layout = false;
options.body = str;
self.render(layout, options, fn, view);
} else if (partial) {
return str;
} else if (fn) {
fn(null, str);
} else {
this.send(str, options.headers, options.status);
}
};
