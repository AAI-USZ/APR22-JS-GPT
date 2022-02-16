var fs = require('graceful-fs'),
async = require('async'),
EventEmitter = require('events').EventEmitter,
util = require('util'),
_ = require('underscore');

var Database = module.exports = function(){
this.store = {};
this.raw = {};
};

Database.prototype.collection = function(name, schema){
