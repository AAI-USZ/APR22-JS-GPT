var _ = require('lodash'),
colors = require('colors'),
moment = require('moment'),
Stream = require('./stream');



var Console = module.exports = function(logger, options){
options = options || {};

Stream.call(this, logger, options);
