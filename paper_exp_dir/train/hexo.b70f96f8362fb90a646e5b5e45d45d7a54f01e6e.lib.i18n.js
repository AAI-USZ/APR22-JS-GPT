var format = require('util').format,
fs = require('fs'),
_ = require('underscore'),
lang = 'default',
compile;

var i18n = function(){
var _store = {};

this.get = function(){
var args = _.toArray(arguments),
str = args.shift();

if (_store[str]) return format.apply(null, args.unshift(_store[str]));
};

this.set = function(str, result){
_store[str] = result;
