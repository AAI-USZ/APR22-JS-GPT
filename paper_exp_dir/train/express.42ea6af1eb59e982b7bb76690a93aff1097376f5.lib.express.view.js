




var path = require('path')
, extname = path.extname
, dirname = path.dirname
, basename = path.basename
, utils = require('connect').utils
, clone = require('./utils').clone
, View = require('./view/view')
, Partial = require('./view/partial')
, merge = utils.merge
, http = require('http')
, mime = utils.mime;



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



http.ServerResponse.prototype.render = function(view, options, fn, parent){

if (typeof options === 'function') {
fn = options, options = {};
}

var self = this
, app = this.app
, options = options || {}
, helpers = app.viewHelpers
, dynamicHelpers = app.dynamicViewHelpers
, viewOptions = app.settings['view options']
, cacheTemplates = app.settings['cache views'];


if (viewOptions) options = merge(clone(viewOptions), options);


var self = this
, root = app.settings.views || process.cwd() + '/views'
, partial = options.renderPartial
, layout = options.layout;


if (true === layout || undefined === layout) {
layout = 'layout';
}


options.scope = options.scope || this.req;


options.parentView = parent;


options.root = root;


options.defaultEngine = app.settings['view engine'];



view = partial
? new Partial(view, options)
: new View(view, options);


if (!view.exists) {
view = partial
? new Partial(view.indexPath, options)
: new View(view.indexPath, options);
}


if (false !== options.dynamicHelpers) {

if (!this.__dynamicHelpers) {
