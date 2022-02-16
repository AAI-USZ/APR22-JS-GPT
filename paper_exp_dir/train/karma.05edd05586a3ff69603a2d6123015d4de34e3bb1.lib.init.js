var readline = require('readline');
var fs = require('fs');
var util = require('util');
var u = require('./util');
var path = require('path');
var launcher = require('./launcher');
var logger = require('./logger');
var log = logger.create('init');
var glob = require('glob');
var CONFIG_TPL_PATH = __dirname + '/../config.template';


var COLORS_ON = {
