var EventEmitter = require('events').EventEmitter,
domain = require('domain'),
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
