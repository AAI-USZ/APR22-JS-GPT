var async = require('async'),
path = require('path'),
fs = require('graceful-fs'),
_ = require('lodash'),
util = require('../util'),
file = util.file2,
yfm = util.yfm,
escape = util.escape;

var removeExtname = function(str){
return str.substring(0, str.length - path.extname(str).length);
};



module.exports = function(data, replace, callback){
if (!callback){
if (typeof replace === 'function'){
callback = replace;
