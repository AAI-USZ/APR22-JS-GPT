var fs = require('fs'),
clc = require('cli-color'),
_ = require('underscore');

module.exports = function(callback){
var pluginDir = hexo.plugin_dir;

fs.exists(pluginDir, function(exist){
if (exist){
var plugins = hexo.config.plugins;

