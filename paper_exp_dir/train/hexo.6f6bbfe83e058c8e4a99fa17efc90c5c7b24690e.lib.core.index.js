

var EventEmitter = require('events').EventEmitter,
path = require('path'),
util = require('../util'),
Router = require('./router'),
Box = require('../box'),
version = require('../../package.json').version,
HexoError = require('../error');
domain = require('domain');



var Hexo = module.exports = function Hexo(){};

Hexo.prototype.__proto__ = EventEmitter.prototype;

Hexo.Box = Box;
Hexo.Error = HexoError;



Hexo.prototype.constant = function(name, value){
var getter;

if (typeof value !== 'function'){
getter = function(){
return value;
};
} else {
getter = value;
}

this.__defineGetter__(name, getter);

return this;
};



Hexo.prototype.bootstrap = function(baseDir, args){


this.constant('core_dir', path.dirname(path.dirname(__dirname)) + path.sep);



this.constant('lib_dir', path.dirname(__dirname) + path.sep);



this.constant('version', version);



this.constant('base_dir', baseDir + path.sep);



this.env = {
args: args,
debug: !!args.debug,
safe: !!args.safe,
silent: !!args.silent,
env: process.env.NODE_ENV || 'development',
version: version,
init: false
};



this.util = util;



this.file = util.file2;



this.route = new Router();



this.locals = require('./locals');



this.render = require('./render');



this.post = require('../post');

return this;
};



Hexo.prototype.call = function(name, args, callback){
if (!callback){
if (typeof args === 'function'){
callback = args;
args = {};
} else {
callback = function(){};
}
}

var console = this.extend.console.get(name);

if (console){
var d = domain.create(),
called = false;

d.on('error', function(err){
!called && callback(err);
});

d.add(console);

d.run(function(){
console(args, function(){
!called && callback.apply(this, arguments);
