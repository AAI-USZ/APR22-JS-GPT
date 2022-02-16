




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
