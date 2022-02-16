var format = require('util').format,
fs = require('fs'),
_ = require('underscore'),
lang = 'default',
compile;

var i18n = function(){

this.get = function(){
var args = _.toArray(arguments),
