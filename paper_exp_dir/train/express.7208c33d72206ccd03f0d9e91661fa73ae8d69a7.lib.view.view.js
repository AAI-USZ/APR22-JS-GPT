




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
