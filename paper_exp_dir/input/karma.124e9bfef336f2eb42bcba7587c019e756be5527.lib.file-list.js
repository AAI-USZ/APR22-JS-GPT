var glob = require('glob');
var mm = require('minimatch');
var fs = require('fs');
var util = require('./util');
var log = require('./logger').create('watcher');


var createWinGlob = function(realGlob) {
return function(pattern, options, done) {
