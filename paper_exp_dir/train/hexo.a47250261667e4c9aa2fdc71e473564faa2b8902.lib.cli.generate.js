var extend = require('../extend'),
route = require('../route'),
util = require('../util'),
file = util.file,
inherits = require('util').inherits,
async = require('async'),
clc = require('cli-color'),
fs = require('fs'),
watchTree = require('fs-watch-tree').watchTree,
_ = require('underscore'),
publicDir = hexo.public_dir,
sourceDir = hexo.source_dir,
cache = {};

var process = function(cache, callback){
var list = route.list(),
keys = Object.keys(list),
generate = require('../generate');

console.log('Generating.');

async.parallel([
