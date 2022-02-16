var colors = require('colors'),
async = require('async'),
fs = require('graceful-fs'),
extend = require('../extend'),
list = extend.deployer.list(),
util = require('../util'),
spawn = util.spawn;

var generate = function(callback){
spawn({
command: 'hexo',
