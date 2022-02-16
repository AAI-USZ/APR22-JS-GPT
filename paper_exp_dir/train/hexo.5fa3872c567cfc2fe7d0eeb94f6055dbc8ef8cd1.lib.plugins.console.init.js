var path = require('path'),
async = require('async'),
term = require('term'),
moment = require('moment'),
fs = require('graceful-fs'),
extend = require('../../extend'),
util = require('../../util'),
file = util.file2,
coreDir = hexo.core_dir,
log = hexo.log;

var throwErr = function(err, msg, next){
var stack = err.stack;

err.name = 'Error';
