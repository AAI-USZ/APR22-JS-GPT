var fs = require('fs'),
clc = require('cli-color');

module.exports = function(callback){
var pluginDir = hexo.plugin_dir;

if (!hexo.config) return callback();

fs.exists(pluginDir, function(exist){
if (exist){
var plugins = hexo.config.plugins;
