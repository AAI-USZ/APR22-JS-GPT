var async = require('async'),
path = require('path'),
fs = require('graceful-fs'),
_ = require('lodash'),
util = require('../util'),
file = util.file2,
yfm = util.yfm,
escape = util.escape;



module.exports = function(data, replace, callback){
if (!callback){
if (typeof replace === 'function'){
callback = replace;
