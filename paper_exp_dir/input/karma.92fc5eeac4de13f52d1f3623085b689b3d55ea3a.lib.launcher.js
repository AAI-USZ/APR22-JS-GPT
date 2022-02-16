var log = require('./logger').create('launcher');

var BaseBrowser = require('./launchers/Base');


BaseBrowser.apply(this, arguments);

this.name = script;

this._getCommand = function() {
return script;
};
};


var Launcher = function(emitter) {
var browsers = [];


var url = 'http://localhost:' + port + urlRoot;
var Cls, browser;

names.forEach(function(name) {
Cls = exports[name + 'Browser'] || ScriptBrowser;
