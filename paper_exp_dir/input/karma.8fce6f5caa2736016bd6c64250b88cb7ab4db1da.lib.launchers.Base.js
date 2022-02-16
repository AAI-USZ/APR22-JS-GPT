var spawn = require('child_process').spawn;
var path = require('path');
var log = require('../logger').create('launcher');
var fs = require('fs');
var env = process.env;


var BaseBrowser = function(id) {

var exitCallback = function() {};

this.id = id;
this.isCaptured = false;

this._tempDir = path.normalize((env.TMPDIR || env.TMP || env.TEMP || '/tmp') + '/testacular-' +
id.toString());

try {
log.debug('Creating temp dir at ' + this._tempDir);
fs.mkdirSync(this._tempDir);
} catch (e) {}


this.start = function(url) {
this._execCommand(this._getCommand(), this._getOptions(url));
};


this.kill = function(callback) {
exitCallback = callback || function() {};

if (this._process.exitCode === null) {
this._process.kill();
} else {
process.nextTick(exitCallback);
}
};


this._getCommand = function() {
