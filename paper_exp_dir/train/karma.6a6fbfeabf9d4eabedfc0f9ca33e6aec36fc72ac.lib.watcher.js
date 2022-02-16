var chokidar = require('chokidar');
var mm = require('minimatch');

var helper = require('./helper');
var log = require('./logger').create('watcher');


var baseDirFromPattern = function(pattern) {
return pattern.replace(/\/[^\/]*[\*\(].*$/, '') || '/';
};

var watchPatterns = function(patterns, watcher) {
