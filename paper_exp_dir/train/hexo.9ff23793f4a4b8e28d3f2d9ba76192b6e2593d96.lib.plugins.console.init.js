var path = require('path'),
async = require('async'),
moment = require('moment'),
fs = require('graceful-fs'),
sprintf = require('sprintf-js').sprintf,
HexoError = require('../../error'),
util = require('../../util'),
file = util.file2;

module.exports = function(args, callback){
var target = hexo.base_dir,
coreDir = hexo.core_dir,
log = hexo.log;

