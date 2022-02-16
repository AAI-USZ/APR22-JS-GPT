




var path = require('path')
, extname = path.extname
, dirname = path.dirname
, basename = path.basename
, fs = require('fs')
, stat = fs.statSync;



exports = module.exports = View;



var cache = {};



function View(view, options) {
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
if (options.attempts) {
if (!~options.attempts.indexOf(this.path))
options.attempts.push(this.path);
}
};



View.prototype.__defineGetter__('exists', function(){
try {
