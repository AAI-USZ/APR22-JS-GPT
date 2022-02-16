var readline = require('readline');
var fs = require('fs');
var util = require('util');
var path = require('path');
var glob = require('glob');

var helper = require('./helper');
var launcher = require('./launcher');
var logger = require('./logger');

var log = logger.create('init');

var CONFIG_TPL_PATH = __dirname + '/../config.template';

