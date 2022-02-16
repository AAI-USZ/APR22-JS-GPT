var fs = require('graceful-fs'),
clc = require('cli-color'),
async = require('async'),
file = require('./util').file,
sep = require('path').sep;

module.exports = function(callback){
var pluginDir = hexo.plugin_dir,
scriptDir = hexo.script_dir,
config = hexo.config;

if (!config) return callback();
