var format = require('util').format;

var LEVELS = ['error', 'warn', 'info', 'debug'];
var COLORS = [ 31,      33,     36,     90];

var globalConfig = {
logLevel: 2,
useColors: false
};

