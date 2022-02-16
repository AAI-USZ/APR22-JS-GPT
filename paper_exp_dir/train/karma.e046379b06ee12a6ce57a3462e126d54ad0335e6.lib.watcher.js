var chokidar = require('chokidar');
var mm = require('minimatch');
var expandBraces = require('expand-braces');

var helper = require('./helper');
var log = require('./logger').create('watcher');

var DIR_SEP = require('path').sep;


var baseDirFromPattern = function(pattern) {
return pattern.replace(/[\/\\][^\/\\]*\*.*$/, '')
.replace(/[\/\\][^\/\\]*[\!\+]\(.*$/, '')
