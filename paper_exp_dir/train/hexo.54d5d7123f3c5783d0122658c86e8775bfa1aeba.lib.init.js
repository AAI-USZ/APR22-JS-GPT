var async = require('async'),
term = require('term'),
yaml = require('yamljs'),
fs = require('graceful-fs'),
path = require('path'),
sep = new RegExp('\\' + path.sep, 'g'),
EventEmitter = require('events').EventEmitter,
_ = require('underscore'),
i18n = require('./i18n'),
Database = require('./db'),
util = require('./util'),
route = require('./route'),
render = require('./render'),
extend = require('./extend'),
call = require('./call');

module.exports = function(args){
var baseDir = process.cwd().replace(sep, '/') + '/',
database = new Database(),
config = {},
init = true;


try {
