var exec = require('child_process').exec;
var path = require('path');
var log = require('./logger').create('launcher');
var env = process.env;
var fs = require('fs');

var counter = 1;


var Browser = function() {

var exitCallback = function() {};

this._getCommand = function() {
var cmd = env[this.ENV_CMD] || this.DEFAULT_CMD[process.platform];
return path.normalize(cmd);
};

this._execCommand = function(cmd) {

log.debug(cmd);
this._process = exec(cmd, function(e) {
if (e && !e.killed) {
log.error(e);
}
});

var tempDir = this._tempDir;
this._process.on('exit', function() {
