var log = require('./logger').create('launcher');

var BaseBrowser = require('./launchers/Base');


var ScriptBrowser = function(id, emitter, timeout, retry, script) {
BaseBrowser.apply(this, arguments);

this.name = script;

this._getCommand = function() {
return script;
};
};


var Launcher = function(emitter) {
var browsers = [];


this.launch = function(names, port, urlRoot, timeout, retryLimit) {
var url = 'http://localhost:' + port + urlRoot;
var Cls, browser;

names.forEach(function(name) {
Cls = exports[name + 'Browser'] || ScriptBrowser;
browser = new Cls(Launcher.generateId(), emitter, timeout, retryLimit, name);

log.info('Starting browser %s', browser.name);

browser.start(url);
browsers.push(browser);
});
};


this.kill = function(callback) {
log.info('Disconnecting all browsers');

var remaining = 0;
var finish = function() {
remaining--;
if (!remaining && callback) {
callback();
}
};

