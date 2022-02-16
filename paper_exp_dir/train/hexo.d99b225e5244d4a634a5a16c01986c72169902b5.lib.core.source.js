var async = require('async'),
pathFn = require('path'),
Box = require('../box'),
util = require('../util'),
file = util.file2;



var Source = module.exports = function Source(){
var base = hexo.source_dir;

Box.call(this, base);
};

Source.prototype.__proto__ = Box.prototype;


Source.prototype.load = Source.prototype.process = function(){
this.processors = hexo.extend.processor.list();
Box.prototype.process.apply(this, arguments);
};
