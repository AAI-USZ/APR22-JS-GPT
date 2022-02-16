var async = require('async'),
fs = require('graceful-fs'),
path = require('path'),
_ = require('lodash'),
Database = require('warehouse'),
Hexo = require('./core'),
HexoError = require('./error'),
Model = require('./model'),
util = require('./util'),
file = util.file2;

module.exports = function(cwd, args, callback){
var baseDir = cwd + '/',
hexo = global.hexo = new Hexo(baseDir, args, {}),
log = hexo.log;

require('./plugins/swig');
require('./plugins/renderer');

hexo.render = require('./render');

async.auto({

config: function(next){
var configPath = path.join(baseDir, '_config.yml');

fs.exists(configPath, function(exist){
if (!exist) return next(null, false);

hexo.render.render({path: configPath}, function(err, result){
