var async = require('async'),
term = require('term'),
yaml = require('yamljs'),
fs = require('graceful-fs'),
path = require('path'),
sep = new RegExp('\\' + path.sep, 'g'),
EventEmitter = require('events').EventEmitter,
_ = require('lodash'),
i18n = require('./i18n'),
Database = require('warehouse'),
util = require('./util'),
route = require('./route'),
render = require('./render'),
extend = require('./extend'),
call = require('./call');

module.exports = function(args){
var baseDir = process.cwd().replace(sep, '/') + '/',
database = new Database(baseDir + 'db.json'),
config = {},
init = true;


try {
config = require(baseDir + '_config.yml');
} catch (e){
init = false;
}

var version = require('../package.json').version,
safe = args.safe ? true : false,
debug = args.debug ? true : false,
newConfig = init ? {} : null,
dirname = __dirname.replace(sep, '/'),
themeDir = init ? baseDir + 'themes/' + config.theme + '/' : null;

