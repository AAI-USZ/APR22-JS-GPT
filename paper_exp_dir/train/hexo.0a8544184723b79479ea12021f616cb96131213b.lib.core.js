

var EventEmitter = require('events').EventEmitter,
path = require('path'),
Logger = require('./logger'),
Router = require('./router'),
Extend = require('./extend'),
util = require('./util'),
version = require('../package.json').version,
env = process.env,
domain;



try {
domain = require('domain');
} catch (err){

}



var Hexo = module.exports = function(baseDir, args){
this.config = {};

this.core_dir = path.dirname(__dirname) + path.sep;
this.lib_dir = __dirname + path.sep;
this.version = version;
this.util = util;

this.base_dir = baseDir + path.sep;
this.public_dir = path.join(baseDir, 'public') + path.sep;
this.source_dir = path.join(baseDir, 'source') + path.sep;
this.plugin_dir = path.join(baseDir, 'node_modules') + path.sep;
this.script_dir = path.join(baseDir, 'scripts') + path.sep;
this.scaffold_dir = path.join(baseDir, 'scaffolds') + path.sep;

this.__defineGetter__('theme_dir', function(){
return path.join(baseDir, 'themes', this.config.theme);
});

this.__defineGetter__('theme_script_dir', function(){
return path.join(baseDir, 'themes', this.config.theme, 'scripts');
});

this.debug = !!args.debug;
this.safe = !!args.save;
this.route = new Router();


var extend = this.extend = new Extend();

