var fs = require('graceful-fs'),
_ = require('lodash'),
term = require('term'),
util = require('util'),
EventEmitter = require('events').EventEmitter;

var Log = module.exports = function(options){
if (options === undefined) options = {};

this.store = [];

this.levels = _.extend({
error: 2,
warn: 4,
info: 6,
