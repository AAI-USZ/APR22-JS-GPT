var moment = require('moment'),
fs = require('graceful-fs'),
Stream = require('./stream'),
os = require('os'),
util = require('../util'),
file = util.file2,
yfm = util.yfm;



var File = module.exports = function(logger, options){
if (!options.path) throw new Error('options.path is not defined');

options = options || {};
