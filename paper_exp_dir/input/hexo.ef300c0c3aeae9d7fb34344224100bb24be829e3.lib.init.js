var async = require('async'),
path = require('path'),
Hexo = require('./core'),
Logger = require('./logger');

module.exports = function(cwd, args, callback){
if (typeof callback !== 'function') callback = function(){};

var hexo = global.hexo = new Hexo();
