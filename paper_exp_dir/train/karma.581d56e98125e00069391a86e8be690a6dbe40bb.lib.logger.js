var format = require('util').format;

var LEVELS = ['result', 'error', 'warn', 'info', 'debug'];
var COLORS = [ 36,       31,      33,     36,     90];

var globalConfig = {
logLevel: 3,
useColors: false
};

var isDefined = function(value) {
return typeof value !== 'undefined';
};

var Logger = function(name, level) {
var createMethod = function(type) {
return function() {
var currentLevel =  isDefined(level) ? level : globalConfig.logLevel;
var index = LEVELS.indexOf(type);


if (index > currentLevel) {
return;
}

var args = Array.prototype.slice.call(arguments);
var prefix = name ? type +  ' (' + name + '):' : type + ':';

if (globalConfig.useColors) {
prefix = '\x1B[' + COLORS[index] + 'm' + prefix + '\x1B[39m';
}
