var EventEmitter = require('events').EventEmitter,
path = require('path'),
util = require('../util'),
Router = require('./router'),
version = require('../../package.json').version,
domain;

try {
domain = require('domain');
} catch (err){}



var Hexo = module.exports = function Hexo(){};

Hexo.prototype.__proto__ = EventEmitter.prototype;



Hexo.prototype.constant = function(name, value){
if (typeof value !== 'function'){
var getter = function(){
return value;
}
} else {
var getter = value;
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



this.scaffold = require('./scaffold');



this.theme = require('./theme');



this.post = require('../post');



this.source = require('./source');

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
if (domain){
var d = domain.create();

d.on('error', function(err){
d.dispose();
callback(err);
});

d.run(function(){
console(args, callback);
});
} else {
try {
console(args, callback);
} catch (err){
callback(err);
}
}
} else {
callback(new Error('Console `' + name + '` not found'));
}

return this;
};
