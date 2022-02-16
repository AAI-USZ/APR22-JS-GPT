var EventEmitter = require('events').EventEmitter,
domain = require('domain'),
path = require('path'),
util = require('util'),
term = require('term'),
Log = require('./log'),
Router = require('./router'),
Extend = require('./extend'),
create = require('./create'),
version = require('../package.json').version,
env = process.env;

var Hexo = module.exports = function(baseDir, args){
this.config = {};

this.base_dir = baseDir;
this.public_dir = path.join(baseDir, 'public');
this.source_dir = path.join(baseDir, 'source');
this.plugin_dir = path.join(baseDir, 'node_modules');
this.script_dir = path.join(baseDir, 'scripts');

this.__defineGetter__('theme_dir', function(){
return path.join(baseDir, 'themes', this.config.theme);
});

var debug = this.debug = !!args.debug;
this.safe = !!args.save;
this.init = false;

var log = this.log = new Log({hide: args.debug ? 9 : 7});
this.route = new Router();

if (debug){
log.setFormat('[:level] ' + ':date[HH:mm:ss]'.blackBright + ' :message');
} else {
log.setFormat('[:level] :message');
}

log.setLevel('updated', 7, 'green');
log.setLevel('deleted', 7, 'red');

var extend = this.extend = new Extend();

[
'console',
'deployer',
