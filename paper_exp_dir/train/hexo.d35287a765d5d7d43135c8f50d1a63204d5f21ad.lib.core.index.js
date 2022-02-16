

var EventEmitter = require('events').EventEmitter,
path = require('path'),
util = require('../util'),
Router = require('./router'),
Box = require('../box'),
version = require('../../package.json').version,
HexoError = require('../error');
domain = null;

try {
domain = require('domain');
} catch (err){}



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
