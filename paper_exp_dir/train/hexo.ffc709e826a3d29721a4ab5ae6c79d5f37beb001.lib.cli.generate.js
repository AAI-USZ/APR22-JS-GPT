var extend = require('../extend'),
route = require('../route'),
util = require('../util'),
file = util.file,
inherits = require('util').inherits,
async = require('async'),
clc = require('cli-color'),
fs = require('fs'),
_ = require('underscore'),
publicDir = hexo.public_dir;

var GenerateError = function(path, msg){
console.log(path);
console.error(msg);
