

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
