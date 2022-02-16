var fs = require('graceful-fs'),
_ = require('underscore');

var Database = module.exports = function(source){
this.source = source || '';

if (source){
try {
this.store = require(source);
} catch (e){
this.store = {};
