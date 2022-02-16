var async = require('async'),
fs = require('graceful-fs'),
path = require('path'),
colors = require('colors'),
moment = require('moment'),
spawn = require('child_process').spawn,
util = require('../../util'),
file = util.file2;

var log = hexo.log,
baseDir = hexo.base_dir,
deployDir = path.join(baseDir, '.deploy'),
publicDir = hexo.public_dir;


