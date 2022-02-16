var log = require('./logger').create('launcher');

var BaseBrowser = require('./launchers/Base');


var ScriptBrowser = function(id, emitter, script) {
BaseBrowser.apply(this, arguments);

this.name = script;

this._getCommand = function() {
return script;
};
};


var Launcher = function(emitter) {
var browsers = [];


this.launch = function(names, port, urlRoot, timeout) {
var url = 'http://localhost:' + port + urlRoot;
var Cls, browser;

names.forEach(function(name) {
Cls = exports[name + 'Browser'] || ScriptBrowser;
browser = new Cls(Launcher.generateId(), emitter, name);

log.info('Starting  browser "%s"', browser.name || 'Custom');

browser.start(url + '?id=' + browser.id);
browsers.push(browser);
});

if (timeout) {
setTimeout(function() {
