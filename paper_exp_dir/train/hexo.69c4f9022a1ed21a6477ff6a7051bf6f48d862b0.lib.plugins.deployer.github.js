var async = require('async'),
fs = require('graceful-fs'),
path = require('path'),
colors = require('colors'),
swig = require('swig'),
spawn = require('child_process').spawn,
util = require('../../util'),
file = util.file2,
commitMessage = require('./util').commitMessage;


var rRepo = /(:|\/)([^\/]+)\/([^\/]+)\.git\/?$/;

module.exports = function(args, callback){
var baseDir = hexo.base_dir,
deployDir = path.join(baseDir, '.deploy'),
publicDir = hexo.public_dir;
