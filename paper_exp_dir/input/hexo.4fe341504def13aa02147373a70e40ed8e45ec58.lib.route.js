var EventEmitter = require('events').EventEmitter,
path = require('path'),
_ = require('underscore'),
store = {},
Route = new EventEmitter();

var format = Route.format = function(str){

