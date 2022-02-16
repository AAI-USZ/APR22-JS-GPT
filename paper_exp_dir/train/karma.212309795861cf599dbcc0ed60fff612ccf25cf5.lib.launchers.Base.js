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
if (self.state === BEING_CAPTURED) {
self.state = CAPTURED;
}
};


this.isCaptured = function() {
return self.state === CAPTURED;
};

