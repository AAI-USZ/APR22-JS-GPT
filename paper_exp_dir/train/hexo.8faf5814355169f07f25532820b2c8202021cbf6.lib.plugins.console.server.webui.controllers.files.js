var async = require('async'),
fs = require('graceful-fs'),
pathFn = require('path'),
sourceDir = hexo.source_dir;

exports.index = function(req, res, next){
var name = req.params[0],
path = pathFn.join(sourceDir, req.params[0]),
raw = req.query.hasOwnProperty('raw');

fs.exists(path, function(exist){
if (!exist) return res.send(404);

fs.stat(path, function(err, stats){
if (err) return next(err);

if (stats.isDirectory()){
fs.readdir(path, function(err, files){
if (err) return next(err);

var arr = [];

async.forEach(files, function(i, next){

if (/^\./.test(i)) return next();

var source = pathFn.join(path, i);

fs.stat(source, function(err, stats){
if (err) return next(err);

arr.push({
name: i,
path: source.substring(sourceDir.length),
is_dir: stats.isDirectory(),
size: stats.size,
ctime: stats.ctime.getTime(),
mtime: stats.mtime.getTime()
});

next();
});
}, function(err){
if (err) return next(err);

