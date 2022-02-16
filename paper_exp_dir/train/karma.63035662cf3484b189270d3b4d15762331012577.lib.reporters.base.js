var util = require('util')

var helper = require('../helper')

var BaseReporter = function (formatError, reportSlow, useColors, adapter) {
this.adapters = [adapter || process.stdout.write.bind(process.stdout)]

this.onRunStart = function () {
this._browsers = []
}

this.onBrowserStart = function (browser) {
this._browsers.push(browser)
}

this.renderBrowser = function (browser) {
var results = browser.lastResult
var totalExecuted = results.success + results.failed
var msg = util.format('%s: Executed %d of %d', browser, totalExecuted, results.total)

if (results.failed) {
msg += util.format(this.X_FAILED, results.failed)
}

if (results.skipped) {
msg += util.format(' (skipped %d)', results.skipped)
}

if (browser.isReady) {
if (results.disconnected) {
msg += this.FINISHED_DISCONNECTED
} else if (results.error) {
msg += this.FINISHED_ERROR
} else if (!results.failed) {
msg += this.FINISHED_SUCCESS
}

msg += util.format(' (%s / %s)', helper.formatTimeInterval(results.totalTime),
helper.formatTimeInterval(results.netTime))
}

return msg
}

this.renderBrowser = this.renderBrowser.bind(this)

this.write = function () {
var msg = util.format.apply(null, Array.prototype.slice.call(arguments))
var self = this
this.adapters.forEach(function (adapter) {
if (!helper.isDefined(adapter.colors)) {
adapter.colors = useColors
}
if (!helper.isDefined(self.EXCLUSIVELY_USE_COLORS) || adapter.colors === self.EXCLUSIVELY_USE_COLORS) {
return adapter(msg)
}
})
}

this.writeCommonMsg = this.write

this.onBrowserError = function (browser, error) {
this.writeCommonMsg(util.format(this.ERROR, browser) + formatError(error, '  '))
