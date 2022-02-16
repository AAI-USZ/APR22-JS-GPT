var async = require('async'),
pathFn = require('path'),
_ = require('lodash'),
util = require('../util'),
file = util.file2,
yfm = util.yfm;


var View = module.exports = function View(source, path, theme){

this.source = source;


this.path = path;


this.extname = pathFn.extname(path);


