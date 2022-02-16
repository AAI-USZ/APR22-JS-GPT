var async = require('async'),
colors = require('colors'),
yaml = require('yamljs'),
fs = require('graceful-fs'),
path = require('path'),
sep = path.sep,
EventEmitter = require('events').EventEmitter,
_ = require('underscore'),
i18n = require('./i18n'),
Database = require('./db'),
util = require('./util'),
route = require('./route'),
render = require('./render'),
extend = require('./extend');

module.exports = function(args){
var baseDir = process.cwd() + sep,
database = new Database();
config = {},
init = true;


try {
config = require(baseDir + '_config.yml');
} catch (e){
init = false;
}
