var async = require('async'),
fs = require('graceful-fs'),
mime = require('mime'),
pathFn = require('path'),
sourceDir = hexo.source_dir;

exports.list = function(req, res, next){
var name = req.params[0],
path = pathFn.join(sourceDir, req.params[0]);

async.waterfall([
function(next){
