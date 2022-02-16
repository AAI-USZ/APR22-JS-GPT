var BaseReporter = require('./Base');


var ProgressReporter = function(formatError, reportSlow) {
BaseReporter.call(this, formatError, reportSlow);


this.writeCommonMsg = function(msg) {
this.write(this._remove() + msg + this._render());
};


this.specSuccess = function(browser) {
this.write(this._refresh());
};


this.onBrowserComplete = function(browser) {
this.write(this._refresh());
};


this.onRunStart = function(browsers) {
this._browsers = browsers;
this._isRendered = false;
};


this._remove = function() {
if (!this._isRendered) {
return '';
}

var cmd = '';
this._browsers.forEach(function() {
cmd += '\x1B[1A' + '\x1B[2K';
});

this._isRendered = false;

return cmd;
};

this._render = function() {
