var fs = require('graceful-fs'),
async = require('async'),
sep = require('path').sep,
yaml = require('yamljs'),
EventEmitter = require('events').EventEmitter,
_ = require('underscore'),
i18n = require('./i18n'),
util = require('./util'),
file = util.file;

module.exports = function(root, options, callback){
async.parallel([
function(next){
file.read(__dirname + '/../package.json', next);
},
