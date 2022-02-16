




var utils = require('../utils')
, extname = utils.extname
, dirname = utils.dirname
, basename = utils.basename
, fs = require('fs');



var cache = {};



var View = exports = module.exports = function View(view, options) {
options = options || {};
this.view = view;
this.root = options.root;
this.relative = false !== options.relative;
this.defaultEngine = options.defaultEngine;
this.parent = options.parentView;
this.basename = basename(view);
