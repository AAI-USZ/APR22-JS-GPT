var fs = require('graceful-fs'),
pathFn = require('path'),
async = require('async'),
HexoError = require('../../error');

var generate = function(asset, callback){
var path = asset.path,
source = asset.full_source;

fs.exists(source, function(exist){
if (!exist){
asset.remove();
return callback();
}

