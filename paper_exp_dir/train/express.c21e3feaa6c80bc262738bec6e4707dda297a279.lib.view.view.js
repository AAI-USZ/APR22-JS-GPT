




var path = require('path')
, utils = require('../utils')
, extname = path.extname
, dirname = path.dirname
, basename = path.basename
, fs = require('fs')
, stat = fs.statSync;



exports = module.exports = View;



var cache = {};
