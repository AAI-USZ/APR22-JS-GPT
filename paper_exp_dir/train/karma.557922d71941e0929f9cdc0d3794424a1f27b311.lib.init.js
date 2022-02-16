var readline = require('readline');
var fs = require('fs');
var util = require('util');
var path = require('path');
var glob = require('glob');

var helper = require('./helper');
var launcher = require('./launcher');
var logger = require('./logger');
var constant = require('./constants');

var log = logger.create('init');

var CONFIG_TPL_PATH = __dirname + '/../config.template';


var COLORS_ON = {
END: '\x1B[39m',
NYAN: '\x1B[36m',
GREEN: '\x1B[32m',
