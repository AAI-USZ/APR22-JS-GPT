var async = require('async'),
path = require('path'),
Hexo = require('./core'),
Logger = require('./logger');

module.exports = function(cwd, args, callback){
if (typeof callback !== 'function') callback = function(){};

var hexo = global.hexo = new Hexo();

hexo.bootstrap(cwd, args);

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
if (err) throw err;



hexo.emit('ready');

var command = args._.shift();

if (command){
var c = hexo.extend.console.get(command);

if (!c || (!hexo.env.init && !c.options.init)){
command = 'help';
}
