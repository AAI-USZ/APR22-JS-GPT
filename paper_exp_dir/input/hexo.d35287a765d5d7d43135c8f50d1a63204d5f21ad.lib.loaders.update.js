var path = require('path'),
async = require('async'),
fs = require('graceful-fs'),
util = require('../util'),
file = util.file2,
HexoError = require('../error');

module.exports = function(callback){
if (!hexo.env.init) return callback();

var packagePath = path.join(hexo.base_dir, 'package.json');

async.waterfall([

function(next){
fs.exists(packagePath, function(exist){
next(null, exist);
});
},

function(exist, next){
