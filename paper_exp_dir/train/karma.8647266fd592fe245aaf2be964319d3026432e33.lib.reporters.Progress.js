var BaseReporter = require('./Base');


var ProgressReporter = function(formatError, reportSlow) {
BaseReporter.call(this, formatError, reportSlow);


this.writeCommonMsg = function(msg) {
this.write(this._remove() + msg + this._render());
};


this.specSuccess = function() {
this.write(this._refresh());
};


this.onBrowserComplete = function() {
this.write(this._refresh());
};

this.onRunStart = function() {
this._browsers = [];
this._isRendered = false;
};

this.onBrowserStart = function(browser) {
this._browsers.push(browser);

if (this._isRendered) {
this.write('\n');
