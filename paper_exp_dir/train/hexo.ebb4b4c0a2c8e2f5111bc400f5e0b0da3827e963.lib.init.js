var async = require('async'),
path = require('path'),
Hexo = require('./core'),
Logger = require('./logger');

module.exports = function(cwd, args, callback){
if (typeof callback !== 'function') callback = function(){};

var hexo = global.hexo = new Hexo();
var configfile = args.config || '_config.yml';

hexo.bootstrap(cwd, args);
hexo.configfile = path.join(hexo.base_dir, configfile);

async.eachSeries([
'logger',
'extend',
'config',
'update',
'database',
'plugins',
'scripts'
], function(name, next){
require('./loaders/' + name)(next);
}, function(err){
if (err){
if (typeof hexo.log !== 'undefined'){
return hexo.log.e(err);
} else {
throw err;
}
}



hexo.emit('ready');

var command = args._.shift();

if (command){
var c = hexo.extend.console.get(command);

if (!c || (!hexo.env.init && !c.options.init)){
command = 'help';
}
} else if (args.v || args.version){
command = 'version';
} else {
command = 'help';
}

if (hexo.env.silent && command === 'help') return callback();

hexo.call(command, args, function(err){
if (err) hexo.log.e(err);


