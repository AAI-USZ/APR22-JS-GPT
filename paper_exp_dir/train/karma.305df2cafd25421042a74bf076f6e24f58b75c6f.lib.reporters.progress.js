var BaseReporter = require('./base')

var ProgressReporter = function (formatError, reportSlow, useColors, browserConsoleLogOptions) {
BaseReporter.call(this, formatError, reportSlow, useColors, browserConsoleLogOptions)

this.EXCLUSIVELY_USE_COLORS = false
this._browsers = []

this.writeCommonMsg = function (msg) {
this.write(this._remove() + msg + this._render())
}

this.specSuccess = function () {
this.write(this._refresh())
}

