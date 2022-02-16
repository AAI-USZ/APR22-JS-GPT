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



var version = require('../package.json').version,
safe = args.safe ? true : false,
debug = args.debug ? true : false,
newConfig = init ? {} : null,
themeDir = init ? baseDir + 'themes' + sep + config.theme + sep : null;


var hexo = global.hexo = {
get base_dir(){return baseDir},
get public_dir(){return baseDir + 'public' + sep},
get source_dir(){return baseDir + 'source' + sep},
get theme_dir(){return themeDir},
get plugin_dir(){return baseDir + 'node_modules' + sep},
get script_dir(){return baseDir + 'scripts' + sep},
get scaffold_dir(){return baseDir + 'scaffolds' + sep},
get core_dir(){return path.dirname(__dirname) + sep},
get lib_dir(){return __dirname + sep},
get version(){return version},
get env(){return process.env},
get safe(){return safe},
get debug(){return debug},
get config(){return newConfig},
get extend(){return extend},
get util(){return util},
get render(){return render},
get i18n(){return i18n.i18n},
get route(){return route},
get process(){return process},
get db(){return database}
};

hexo.site = {};
hexo.__proto__ = EventEmitter.prototype;

process.on('exit', function(){
hexo.emit('exit');
});

if (init){

_.each(config, function(val, key){
