






var log4js = require('log4js');
var helper = require('./helper');
var constant = require('./constants');


var LogWrapper = function(name, level) {
this.logger = log4js.getLogger(name);
