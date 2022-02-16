

var fs = require('graceful-fs'),
_ = require('lodash'),
term = require('term'),
util = require('util'),
EventEmitter = require('events').EventEmitter;



var Log = module.exports = function(options){
