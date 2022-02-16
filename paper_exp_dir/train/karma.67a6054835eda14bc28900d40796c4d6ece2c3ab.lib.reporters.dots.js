var BaseReporter = require('./base')

var DotsReporter = function (formatError, reportSlow) {
BaseReporter.call(this, formatError, reportSlow)

var DOTS_WRAP = 80

this.onRunStart = function () {
this._browsers = []
this._dotsCount = 0
}
