var log = require('./logger').create('launcher');

var BaseBrowser = require('./launchers/Base');


var ScriptBrowser = function(id, script) {
BaseBrowser.apply(this, arguments);

this.name = script;

this._getCommand = function() {
