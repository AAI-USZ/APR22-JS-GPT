var async = require('async'),
fs = require('graceful-fs'),
path = require('path'),
colors = require('colors'),
moment = require('moment'),
spawn = require('child_process').spawn,
util = require('../../../util'),
file = util.file2;

var log = hexo.log,
baseDir = hexo.base_dir;

var run = function(command, args, callback){
var cp = spawn(command, args, {cwd: baseDir});
