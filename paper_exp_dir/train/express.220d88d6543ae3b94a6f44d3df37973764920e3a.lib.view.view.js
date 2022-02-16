




var utils = require('../utils')
, extname = utils.extname
, dirname = utils.dirname
, basename = utils.basename
, fs = require('fs')
, stat = fs.statSync;



var cache = {};



var exists = {};



var View = exports = module.exports = function View(view, options) {
options = options || {};

this.view = view;
this.root = options.root;
this.relative = false !== options.relative;
this.defaultEngine = options.defaultEngine;
this.parent = options.parentView;
this.basename = basename(view);
this.engine = this.resolveEngine();
this.extension = '.' + this.engine;
this.name = this.basename.replace(this.extension, '');
this.path = this.resolvePath();
this.dirname = dirname(this.path);
};



View.prototype.__defineGetter__('exists', function(){
var path = this.path;
if (null != exists[path]) {
return exists[path];
} else {
