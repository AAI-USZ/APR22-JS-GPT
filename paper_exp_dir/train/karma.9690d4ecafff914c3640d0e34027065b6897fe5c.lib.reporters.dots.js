var BaseReporter = require('./base')

var DotsReporter = function (formatError, reportSlow) {
BaseReporter.call(this, formatError, reportSlow)

var DOTS_WRAP = 80

this.onRunStart = function () {
this._browsers = []
this._dotsCount = 0
}

this.onBrowserStart = function (browser) {
this._browsers.push(browser)
}

this.writeCommonMsg = function (msg) {
if (this._dotsCount) {
this._dotsCount = 0
msg = '\n' + msg
}

this.write(msg)
}

this.specSuccess = function () {
this._dotsCount = (this._dotsCount + 1) % DOTS_WRAP
this.write(this._dotsCount ? '.' : '.\n')
}

this.onBrowserComplete = function (browser) {
this.writeCommonMsg(this.renderBrowser(browser) + '\n')
}
