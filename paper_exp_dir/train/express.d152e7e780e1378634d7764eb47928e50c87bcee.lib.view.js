




var path = require('path')
, extname = path.extname
, dirname = path.dirname
, basename = path.basename
, utils = require('connect').utils
, View = require('./view/view')
, Partial = require('./view/partial')
, union = require('./utils').union
, merge = utils.merge
, http = require('http')
, res = http.ServerResponse.prototype;



var cache = {};



exports = module.exports = View;
exports.Partial = Partial;



exports.register = View.register;



function renderPartial(res, view, options, locals, parent){

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


union(options, locals);


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
return res.render(view, options, null, parent);
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
