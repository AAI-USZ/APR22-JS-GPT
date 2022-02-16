var BaseReporter = require('./base')

var ProgressReporter = function (formatError, reportSlow) {
BaseReporter.call(this, formatError, reportSlow)

this.writeCommonMsg = function (msg) {
this.write(this._remove() + msg + this._render())
}

this.specSuccess = function () {
this.write(this._refresh())
