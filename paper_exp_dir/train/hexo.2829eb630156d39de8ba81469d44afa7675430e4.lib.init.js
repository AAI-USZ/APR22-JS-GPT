var async = require('async'),
fs = require('graceful-fs'),
path = require('path'),
_ = require('lodash'),
Hexo = require('./core'),
HexoError = require('./error'),
util = require('./util'),
file = util.file2;

module.exports = function(cwd, args){
