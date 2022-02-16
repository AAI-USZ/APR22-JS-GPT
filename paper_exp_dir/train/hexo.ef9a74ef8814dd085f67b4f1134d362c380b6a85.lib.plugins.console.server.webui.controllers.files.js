var async = require('async'),
fs = require('graceful-fs'),
pathFn = require('path'),
sourceDir = hexo.source_dir;

exports.index = function(req, res, next){
var name = req.params[0],
path = pathFn.join(sourceDir, req.params[0]),
raw = req.query.hasOwnProperty('raw');

fs.exists(path, function(exist){
