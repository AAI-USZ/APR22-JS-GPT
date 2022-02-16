

var moment = require('moment'),
fs = require('graceful-fs'),
Stream = require('./stream');



var File = module.exports = function(logger, options){
if (!options.path) throw new Error('options.path is not defined');

options = options || {};
