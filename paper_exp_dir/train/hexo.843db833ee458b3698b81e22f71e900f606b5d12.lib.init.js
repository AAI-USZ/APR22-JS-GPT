var async = require('async'),
colors = require('colors'),
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
extend = require('./extend');

module.exports = function(args){
var baseDir = process.cwd().replace(sep, '/') + '/',
database = new Database(),
config = {},
init = true;


try {
config = require(baseDir + '_config.yml');
} catch (e){
init = false;
}

if (init){
try {
var data = require(baseDir + 'db.json');
database.import(data);
} catch (e){

}
}

var version = require('../package.json').version,
safe = args.safe ? true : false,
debug = args.debug ? true : false,
newConfig = init ? {} : null,
dirname = __dirname.replace(sep, '/'),
themeDir = init ? baseDir + 'themes/' + config.theme + '/' : null;


var hexo = global.hexo = {
get base_dir(){return baseDir},
get public_dir(){return baseDir + 'public/'},
get source_dir(){return baseDir + 'source/'},
get theme_dir(){return themeDir},
get plugin_dir(){return baseDir + 'node_modules/'},
get script_dir(){return baseDir + 'scripts/'},
get scaffold_dir(){return baseDir + 'scaffolds/'},
get core_dir(){return path.dirname(dirname)},
get lib_dir(){return dirname + '/'},
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
get db(){return database}
};

hexo.cache = {};
hexo.__proto__ = EventEmitter.prototype;

process.on('exit', function(){
hexo.emit('exit');
});

