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
DEFAULT_CMD: {
linux: '/usr/bin/google-chrome',
darwin: '/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome'
},
ENV_CMD: 'CHROME_BIN'
};


var ChromeCanaryBrowser = function() {
ChromeBrowser.apply(this, arguments);
};

ChromeCanaryBrowser.prototype = {
DEFAULT_CMD: {
linux: '/usr/bin/google-chrome-canary',
darwin: '/Applications/Google\\ Chrome\\ Canary.app/Contents/MacOS/Google\\ Chrome\\ Canary'
},
ENV_CMD: 'CHROME_CANARY_BIN'
};


var FirefoxBrowser = function() {
Browser.apply(this, arguments);

this.start = function(url) {
var self = this;
var command = this._getCommand();


exec(command + ' -createprofile testacular', function(e, stdout, stderr) {
if (e) {
log.error(e);
}

var profile = /at\s\'(.*)\/prefs\.js\'/.exec(stderr.toString())[1];
var prefs = 'user_pref("browser.shell.checkDefaultBrowser", false);\n' +
'user_pref("browser.bookmarks.restore_default_bookmarks", false);\n';

self._tempDir = profile.replace(/\s/g, '\\ ');
fs.createWriteStream(profile + '/prefs.js', {flags: 'a'}).write(prefs);
self._execCommand(command + ' -profile ' + self._tempDir + ' ' + url);
});
};
};

FirefoxBrowser.prototype = {
DEFAULT_CMD: {
linux: '/usr/bin/firefox',
darwin: '/Applications/Firefox.app/Contents/MacOS/firefox-bin'
},
ENV_CMD: 'FIREFOX_BIN'
};


var OperaBrowser = function() {
Browser.apply(this, arguments);

this._getOptions = function(url) {
// Opera CLI options
// http://www.opera.com/docs/switches/
return [
'-personaldir ' + this._tempDir,
'-nomail',
url
];
};
};

OperaBrowser.prototype = {
DEFAULT_CMD: {
linux: '/usr/bin/opera',
darwin: '/Applications/Opera.app/Contents/MacOS/Opera'
},
ENV_CMD: 'OPERA_BIN'
};


var SafariBrowser = function() {
Browser.apply(this, arguments);

this.start = function(url) {
var HTML_TPL = path.normalize(__dirname + '/../static/safari.html');
var self = this;

fs.readFile(HTML_TPL, function(err, data) {
