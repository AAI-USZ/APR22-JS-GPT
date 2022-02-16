var async = require('async'),
fs = require('graceful-fs'),
util = require('../../util'),
file = util.file2;

module.exports = function(args, callback){
if (!hexo.init) return callback();

var log = hexo.log;

