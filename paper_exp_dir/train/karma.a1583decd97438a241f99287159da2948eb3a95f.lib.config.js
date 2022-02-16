var path = require('path');

var logger = require('./logger');
var log = logger.create('config');
var helper = require('./helper');
var constant = require('./constants');



try {
require('coffee-script').register();
} catch (e) {}



try {
require('LiveScript');
} catch (e) {}

var Pattern = function(pattern, served, included, watched) {
