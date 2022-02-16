var EventEmitter = require('events').EventEmitter,
fs = require('graceful-fs'),
moment = require('moment'),
path = require('path'),
util = require('util'),
colors = require('colors'),
Log = require('./log'),
Router = require('./router'),
Extend = require('./extend'),
version = require('../package.json').version,
env = process.env,
domain;

try {
domain = require('domain');
} catch (err){

}

var Hexo = module.exports = function(baseDir, args){
this.config = {};

this.base_dir = baseDir;
this.public_dir = path.join(baseDir, 'public');
this.source_dir = path.join(baseDir, 'source');
this.plugin_dir = path.join(baseDir, 'node_modules');
this.script_dir = path.join(baseDir, 'scripts');
