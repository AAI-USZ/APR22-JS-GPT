var async = require('async'),
fs = require('graceful-fs'),
pathFn = require('path'),
sourceDir = hexo.source_dir;

exports.list = function(req, res, next){
var name = req.params[0],
path = pathFn.join(sourceDir, req.params[0]);

async.waterfall([
function(next){
fs.exists(path, function(exist){
if (!exist) return res.send(404);
next();
});
},
