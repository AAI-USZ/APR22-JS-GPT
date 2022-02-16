




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



exports.lookup = function(view, options){
var orig = view = new View(view, options);


if (partial) {
view = new View(orig.prefixPath, options);
if (!view.exists) view = orig;
}


if (!view.exists) view = new View(orig.indexPath, options);


