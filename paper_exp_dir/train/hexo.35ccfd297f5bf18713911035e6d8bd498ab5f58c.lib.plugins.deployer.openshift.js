var colors = require('colors'),
path = require('path'),
moment = require('moment'),
spawn = require('child_process').spawn,
util = require('../../util'),
file = util.file2;

var log = hexo.log,
baseDir = hexo.base_dir,
publicDir = hexo.public_dir;

var run = function(command, args, callback){
