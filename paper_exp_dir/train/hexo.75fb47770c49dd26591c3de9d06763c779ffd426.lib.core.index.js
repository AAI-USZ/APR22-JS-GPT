

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
