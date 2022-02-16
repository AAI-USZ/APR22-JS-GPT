




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
}
}
return res.render(view, options, null, parent, true);
}


if (collection) {
var len = collection.length
, buf = ''
, keys
, key
