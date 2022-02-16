var spawn = require('child_process').spawn;
var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');

var log = require('../logger').create('launcher');
var env = process.env;

var BEING_CAPTURED = 1;
var CAPTURED = 2;
var BEING_KILLED = 3;
var FINISHED = 4;
var BEING_TIMEOUTED = 5;


var BaseBrowser = function(id, emitter, captureTimeout, retryLimit) {
var self = this;
var capturingUrl;
var exitCallback = function() {};

this.id = id;
this.state = null;
this._tempDir = path.normalize((env.TMPDIR || env.TMP || env.TEMP || '/tmp') + '/karma-' +
id.toString());


this.start = function(url) {
capturingUrl = url;
self.state = BEING_CAPTURED;

try {
log.debug('Creating temp dir at ' + self._tempDir);
fs.mkdirSync(self._tempDir);
} catch (e) {}

self._start(capturingUrl + '?id=' + self.id);

if (captureTimeout) {
setTimeout(self._onTimeout, captureTimeout);
}
};


this._start = function(url) {
self._execCommand(self._getCommand(), self._getOptions(url));
};


this.markCaptured = function() {
self.state = CAPTURED;
};


this.isCaptured = function() {
return self.state === CAPTURED;
};


this.kill = function(callback) {
exitCallback = callback || function() {};

log.debug('Killing %s', self.name);

if (self.state !== FINISHED) {
self.state = BEING_KILLED;
self._process.kill();
} else {
process.nextTick(exitCallback);
}
};


this._onTimeout = function() {
if (self.state !== BEING_CAPTURED) {
return;
}

log.warn('%s have not captured in %d ms, killing.', self.name, captureTimeout);

self.state = BEING_TIMEOUTED;
self._process.kill();
};


this.toString = function() {
return self.name;
};


this._getCommand = function() {
var cmd = path.normalize(env[self.ENV_CMD] || self.DEFAULT_CMD[process.platform]);

if (!cmd) {
log.error('No binary for %s browser on your platform.\n\t' +
'Please, set "%s" env variable.', self.name, self.ENV_CMD);
}

return cmd;
};


this._execCommand = function(cmd, args) {

if (cmd.charAt(0) === cmd.charAt(cmd.length - 1) && '\'`"'.indexOf(cmd.charAt(0)) !== -1) {
cmd = cmd.substring(1, cmd.length - 1);
log.warn('The path should not be quoted.\n  Normalized the path to %s', cmd);
}

log.debug(cmd + ' ' + args.join(' '));
self._process = spawn(cmd, args);

var errorOutput = '';

