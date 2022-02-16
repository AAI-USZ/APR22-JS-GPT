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
exec('rm -rf "' + tempDir + '"', exitCallback);
});
};

this._getOptions = function(url) {
return [url];
};

this._tempDir = path.normalize((env.TMPDIR || env.TMP || env.TEMP || '/tmp') + '/testacular-' + id.toString());

try {
log.debug('Creating temp dir at ' + this._tempDir);
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
linux: 'google-chrome',
darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
win32: process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe'
},
ENV_CMD: 'CHROME_BIN'
};


var ChromeCanaryBrowser = function() {
ChromeBrowser.apply(this, arguments);

var parentOptions = this._getOptions;
this._getOptions = function(url) {

return parentOptions.call(this, url).concat(['--js-flags="--nocrankshaft --noopt"']);
};
};

ChromeCanaryBrowser.prototype = {
name: 'ChromeCanary',

DEFAULT_CMD: {
linux: 'google-chrome-canary',
darwin: '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
win32: process.env.LOCALAPPDATA + '\\Google\\Chrome SxS\\Application\\chrome.exe'
},
ENV_CMD: 'CHROME_CANARY_BIN'
};


var FirefoxBrowser = function() {
Browser.apply(this, arguments);

this.start = function(url) {
var self = this;
var command = this._getCommand();


exec(command + ' -CreateProfile testacular', function(e, stdout, stderr) {
if (e) {
log.error(e);
}

var match = /at\s\'(.*)\/prefs\.js\'/.exec(stderr.toString());

if (match) {
var profile = self._tempDir = match[1];
var prefs = 'user_pref("browser.shell.checkDefaultBrowser", false);\n' +
'user_pref("browser.bookmarks.restore_default_bookmarks", false);\n';

fs.createWriteStream(profile + '/prefs.js', {flags: 'a'}).write(prefs);
self._execCommand(command + ' -profile "' + profile + '" ' + url);
} else {
log.warn('Cannot create Firefox profile');
self._execCommand(command + ' ' + url);
}
});
};
};

FirefoxBrowser.prototype = {
name: 'Firefox',

DEFAULT_CMD: {
linux: 'firefox',
darwin: '/Applications/Firefox.app/Contents/MacOS/firefox-bin',
win32: process.env.ProgramFiles + '\\Mozilla Firefox\\firefox.exe'
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
name: 'Opera',

DEFAULT_CMD: {
linux: 'opera',
darwin: '/Applications/Opera.app/Contents/MacOS/Opera',
win32: process.env.ProgramFiles + '\\Opera\\opera.exe'
},
ENV_CMD: 'OPERA_BIN'
};


var SafariBrowser = function() {
Browser.apply(this, arguments);

this.start = function(url) {
var HTML_TPL = path.normalize(__dirname + '/../static/safari.html');
var self = this;

fs.readFile(HTML_TPL, function(err, data) {
var content = data.toString().replace('%URL%', url);
var staticHtmlPath = self._tempDir + '/redirect.html';

fs.writeFile(staticHtmlPath, content, function(err) {
self._execCommand(self._getCommand() + ' ' + staticHtmlPath);
});
});
};
};

SafariBrowser.prototype = {
name: 'Safari',

DEFAULT_CMD: {
darwin: '/Applications/Safari.app/Contents/MacOS/Safari'
},
ENV_CMD: 'SAFARI_BIN'
};


var PhantomJSBrowser = function() {
Browser.apply(this, arguments);

this.start = function(url) {
// create the js file, that will open testacular
var captureFile = this._tempDir + '/capture.js';
var captureCode = '(new WebPage()).open("' + url + '");';
fs.createWriteStream(captureFile).end(captureCode);

// and start phantomjs
this._execCommand(this._getCommand() + ' ' + captureFile);
};
};

PhantomJSBrowser.prototype = {
name: 'PhantomJS',

DEFAULT_CMD: {
linux: 'phantomjs',
darwin: '/usr/local/bin/phantomjs'
},
ENV_CMD: 'PHANTOMJS_BIN'
};


var IE8Browser = function() {
Browser.apply(this, arguments);
};

IE8Browser.prototype = {
name: 'IE8',
DEFAULT_CMD: {
// darwin: '/usr/local/bin/ie8',
// linux: '/usr/bin/ie8'
// win32: ''
},
ENV_CMD: 'IE8_BIN'
};


var IE9Browser = function() {
Browser.apply(this, arguments);
};

IE9Browser.prototype = {
name: 'IE9',
DEFAULT_CMD: {
// darwin: '/usr/local/bin/ie9',
// linux: '/usr/bin/ie9'
// win32: ''
},
ENV_CMD: 'IE9_BIN'
};


var ScriptBrowser = function(id, script) {
Browser.apply(this, arguments);

this.name = script;

this._getCommand = function() {
return '"' + script + '"';
};
};


var Launcher = function() {
