var EventEmitter = require('events').EventEmitter,
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
this.config = {};

this.base_dir = baseDir + path.sep;
this.public_dir = path.join(baseDir, 'public') + path.sep;
this.source_dir = path.join(baseDir, 'source') + path.sep;
this.plugin_dir = path.join(baseDir, 'node_modules') + path.sep;
this.script_dir = path.join(baseDir, 'scripts') + path.sep;
this.scaffold_dir = path.join(baseDir, 'scaffolds') + path.sep;

this.__defineGetter__('theme_dir', function(){
return path.join(baseDir, 'themes', this.config.theme);
});

var debug = this.debug = !!args.debug;
this.safe = !!args.save;
this.init = false;

var log = this.log = new Log();
this.route = new Router();

if (args._test){
log.setHide(0);
} else if (debug){
log.setHide(9);
} else {
log.setHide(7);
}

if (debug){
