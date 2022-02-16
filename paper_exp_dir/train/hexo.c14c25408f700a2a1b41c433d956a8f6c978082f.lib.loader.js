var fs = require('graceful-fs'),
colors = require('colors'),
async = require('async'),
file = require('./util').file,
sep = require('path').sep,
_ = require('underscore');

module.exports = function(callback){
var pluginDir = hexo.plugin_dir,
scriptDir = hexo.script_dir;

if (!hexo.config) return callback();

async.parallel([

function(next){
fs.exists(pluginDir, function(exist){
if (!exist) return next();

