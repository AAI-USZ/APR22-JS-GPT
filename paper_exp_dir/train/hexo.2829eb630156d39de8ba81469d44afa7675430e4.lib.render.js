var async = require('async'),
pathFn = require('path'),
_ = require('lodash'),
util = require('./util'),
file = util.file2,
yfm = util.yfm;

var cache = {};

var Render = module.exports = function(core){
