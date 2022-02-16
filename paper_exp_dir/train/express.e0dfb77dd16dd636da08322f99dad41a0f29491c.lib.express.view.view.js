




var path = require('path')
, extname = path.extname
, dirname = path.dirname
, basename = path.basename
, fs = require('fs');



var cache = {};



var View = exports = module.exports = function View(view, options) {
options = options || {};
