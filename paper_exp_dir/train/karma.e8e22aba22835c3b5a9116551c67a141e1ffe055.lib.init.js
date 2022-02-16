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


var COLORS_ON = {
END: '\x1B[39m',
NYAN: '\x1B[36m',
GREEN: '\x1B[32m',
BOLD: '\x1B[1m',
bold: function(str) {
return this.BOLD + str + '\x1B[22m';
},
green: function(str) {
return this.GREEN + str + this.END;
}
};


var colors = COLORS_ON;

var COLORS_OFF = {
END: '',
NYAN: '',
GREEN: '',
BOLD: '',
bold: function(str) {
return str;
},
