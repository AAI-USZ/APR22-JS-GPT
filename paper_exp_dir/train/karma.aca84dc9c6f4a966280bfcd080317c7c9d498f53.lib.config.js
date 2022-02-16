var path = require('path');

var logger = require('./logger');
var log = logger.create('config');
var helper = require('./helper');
var constant = require('./constants');

var COFFEE_SCRIPT_AVAILABLE = false;
var LIVE_SCRIPT_AVAILABLE = false;



try {
require('coffee-script').register();
COFFEE_SCRIPT_AVAILABLE = true;
} catch (e) {}

