var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var path = require('path');
var log = require('./logger').create('launcher');
var env = process.env;
var fs = require('fs');
var util = require('./util');


var Browser = function(id) {

var exitCallback = function() {};

this._getCommand = function() {
return path.normalize(env[this.ENV_CMD] || this.DEFAULT_CMD[process.platform]);
};

this._execCommand = function(cmd, args) {
log.debug(cmd + ' ' + args.join(' '));
this._process = spawn(cmd, args);
