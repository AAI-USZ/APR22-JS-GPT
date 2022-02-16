

var fs = require('graceful-fs'),
pathFn = require('path'),
async = require('async'),
_ = require('lodash'),
chokidar = require('chokidar'),
EOL = require('os').EOL,
EOLre = new RegExp(EOL, 'g');

if (!fs.exists || !fs.existsSync){
fs.exists = pathFn.exists;
fs.existsSync = pathFn.existsSync;
}

var join = function(parent, child){
return parent ? pathFn.join(parent, child) : child;
};



var mkdirs = exports.mkdirs = function(path, callback){
var parent = pathFn.dirname(path);

fs.exists(parent, function(exist){
if (exist){
