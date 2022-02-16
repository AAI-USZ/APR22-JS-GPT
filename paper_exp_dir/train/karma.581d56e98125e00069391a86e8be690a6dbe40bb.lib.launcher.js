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

this._tempDir = env.TMPDIR + id;

try {
fs.mkdirSync(this._tempDir);
} catch (e) {}


this.start = function(url) {
this._execCommand(this._getCommand() + ' ' + this._getOptions(url).join(' '));
};

this.kill = function(callback) {
exitCallback = callback || function() {};

if (this._process.exitCode === null) {
this._process.kill();
} else {
process.nextTick(exitCallback);
}
};
};


var ChromeBrowser = function() {
Browser.apply(this, arguments);

this._getOptions = function(url) {


return [
'--user-data-dir=' + this._tempDir,
'--no-default-browser-check',
'--no-first-run',
'--disable-default-apps',
url
];
};
};

ChromeBrowser.prototype = {
name: 'Chrome',

DEFAULT_CMD: {
linux: '/usr/bin/google-chrome',
darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
win32: process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe'
},
ENV_CMD: 'CHROME_BIN'
};

