var util = require('util');
var colors = require('colors');


var LEVELS = ['result', 'error', 'warn',   'info', 'debug'];
var COLORS = [ 'cyan',  'red',   'yellow', 'cyan',  'grey'];

var globalConfig = {
logLevel: 3,
useColors: true
};
