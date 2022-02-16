var spawn = require('child_process').spawn;
var path = require('path');
var log = require('./logger').create('launcher');
var env = process.env;
var fs = require('fs');
var util = require('./util');


var generate = {
id: function() {
return Math.floor(Math.random() * 100000000);
}
};



var Browser = function(id) {

var exitCallback = function() {};

this._getCommand = function() {
return path.normalize(env[this.ENV_CMD] || this.DEFAULT_CMD[process.platform]);
};

this._execCommand = function(cmd, args) {
log.debug(cmd + ' ' + args.join(' '));
this._process = spawn(cmd, args);

var errorOutput = '';
this._process.stderr.on('data', function(data) {
errorOutput += data.toString();
});

var self = this;
this._process.on('exit', function(code) {
if (code) {
log.error('Cannot start %s\n\t%s', self.name, errorOutput);
}

log.debug('Cleaning %s', self._tempDir);
spawn('rm', ['-rf', self._tempDir]).on('exit', exitCallback);
});
};

this._getOptions = function(url) {
return [url];
};

this.id = id;
this.isCaptured = false;

this._tempDir = path.normalize((env.TMPDIR || env.TMP || env.TEMP || '/tmp') + '/testacular-' + id.toString());

try {
log.debug('Creating temp dir at ' + this._tempDir);
fs.mkdirSync(this._tempDir);
} catch (e) {}

