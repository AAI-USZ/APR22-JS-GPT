var async = require('async'),
fs = require('graceful-fs'),
path = require('path'),
term = require('term'),
_ = require('lodash'),
EventEmitter = require('events').EventEmitter,
Database = require('warehouse'),
call = require('./call'),
extend = require('./extend'),
i18n = require('./i18n'),
render = require('./render'),
util = require('./util');

module.exports = function(args){
var safe = args.safe ? true : false,
debug = args.debug ? true : false,
dirname = __dirname,
baseDir = process.cwd() + '/',
db = new Database(baseDir + 'db.json'),
config = {};

var hexo = global.hexo = {
get base_dir(){return baseDir},
get public_dir(){return baseDir + 'public/'},
get source_dir(){return baseDir + 'source/'},
get theme_dir(){return baseDir + 'themes/' + config.theme + '/'},
get plugin_dir(){return baseDir + 'node_modules/'},
get script_dir(){return baseDir + 'scripts/'},
get scaffold_dir(){return baseDir + 'scaffolds/'},
get core_dir(){return path.dirname(dirname) + '/'},
get lib_dir(){return dirname + '/'},
get version(){return require('../package.json').version},
get env(){return env},
get safe(){return safe},
get debug(){return debug},
get config(){return config},
get extend(){return extend},
get render(){return render},
get util(){return util},
get call(){return call},
get i18n(){return i18n.i18n},
get route(){return route},
get db(){return db}
};


