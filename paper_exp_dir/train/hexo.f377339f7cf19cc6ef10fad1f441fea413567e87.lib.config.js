var path = require('path'),
sep = path.sep,
yaml = require('yamljs'),
EventEmitter = require('events').EventEmitter,
_ = require('underscore'),
i18n = require('./i18n'),
db = require('./db'),
util = require('./util'),
route = require('./route'),
render = require('./render'),
extend = require('./extend');

module.exports = function(root, options, callback){
var baseDir = root + sep,
config,
init = true;

try {
config = require(baseDir + '_config.yml');
} catch (e){
init = false;
} finally {
var version = require('../package.json').version,
safe = options.safe ? true : false,
