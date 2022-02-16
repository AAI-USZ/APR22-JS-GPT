var chokidar = require('chokidar');
var mm = require('minimatch');

var helper = require('./helper');
var log = require('./logger').create('watcher');

var DIR_SEP = require('path').sep;


var baseDirFromPattern = function(pattern) {
return pattern.replace(/\/[^\/]*[\*\(].*$/, '') || '/';
};

var watchPatterns = function(patterns, watcher) {

var pathsToWatch = [];
var uniqueMap = {};
