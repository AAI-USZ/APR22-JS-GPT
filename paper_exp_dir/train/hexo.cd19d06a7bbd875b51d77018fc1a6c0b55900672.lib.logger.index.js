var format = require('util').format,
_ = require('lodash'),
EventEmitter = require('events').EventEmitter;



var Logger = module.exports = function(options){
options = options || {};



this.store = [];


