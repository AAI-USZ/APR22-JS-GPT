var exec = require('child_process').exec;
var path = require('path');
var log = require('./logger').create('launcher');
var env = process.env;
var fs = require('fs');
var util = require('./util');

var counter = 1;


var Browser = function(id) {

var exitCallback = function() {};

this._getCommand = function() {
var cmd = env[this.ENV_CMD] || this.DEFAULT_CMD[process.platform];
return '"' + path.normalize(cmd) + '"';
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
log.debug('Cleaning the profile at %s', tempDir);
exec('rm -rdf ' + tempDir, exitCallback);
});
};

this._getOptions = function(url) {
return [url];
};

this._tempDir = (env.TMPDIR || env.TMP || env.TEMP || '/tmp') + '/testacular-' + id;

try {
log.debug('Creating temp dir at ' + this._tempDir);
fs.mkdirSync(this._tempDir);
} catch (e) {}


this.start = function(url) {
this._execCommand(this._getCommand() + ' ' + this._getOptions(url).join(' '));
};

this.kill = function(callback) {
