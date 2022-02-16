var EventEmitter = require('events').EventEmitter,
domain = require('domain'),
path = require('path'),
util = require('util'),
term = require('term'),
Log = require('./log'),
Router = require('./router'),
Extend = require('./extend'),
version = require('../package.json').version,
env = process.env;

var Hexo = module.exports = function(baseDir, args){
this.config = {};

this.base_dir = baseDir;
this.public_dir = path.join(baseDir, 'public');
this.source_dir = path.join(baseDir, 'source');
this.plugin_dir = path.join(baseDir, 'node_modules');
