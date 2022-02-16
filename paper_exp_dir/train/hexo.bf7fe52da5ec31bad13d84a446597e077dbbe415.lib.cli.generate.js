var extend = require('../extend'),
route = require('../route'),
util = require('../util'),
file = util.file,
spawn = util.spawn,
inherits = require('util').inherits,
async = require('async'),
colors = require('colors'),
fs = require('fs'),
_ = require('underscore'),
publicDir = hexo.public_dir,
cache = {};

var process = function(cache, callback){
