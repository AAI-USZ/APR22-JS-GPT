var pathFn = require('path'),
async = require('async'),
fs = require('graceful-fs'),
util = require('../util'),
file = util.file2,
HexoError = require('../error');

module.exports = function(callback){
if (!hexo.env.init) return callback();

var packagePath = pathFn.join(hexo.base_dir, 'package.json'),
log = hexo.log;

async.waterfall([

function(next){
fs.exists(packagePath, function(exist){
if (exist) return next();

