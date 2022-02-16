'use strict'

const util = require('util')

const constants = require('../constants')
const helper = require('../helper')

const BaseReporter = function (formatError, reportSlow, useColors, browserConsoleLogOptions, adapter) {
this.adapters = [adapter || process.stdout.write.bind(process.stdout)]

this.USE_COLORS = false
this.EXCLUSIVELY_USE_COLORS = undefined
this.LOG_SINGLE_BROWSER = '%s: %s\n'
this.LOG_MULTI_BROWSER = '%s %s: %s\n'

this.SPEC_FAILURE = '%s %s FAILED' + '\n'
this.SPEC_SLOW = '%s SLOW %s: %s\n'
this.ERROR = '%s ERROR\n'

this.FINISHED_ERROR = ' ERROR'
this.FINISHED_SUCCESS = ' SUCCESS'
this.FINISHED_DISCONNECTED = ' DISCONNECTED'

this.X_FAILED = ' (%d FAILED)'

this.TOTAL_SUCCESS = 'TOTAL: %d SUCCESS\n'
this.TOTAL_FAILED = 'TOTAL: %d FAILED, %d SUCCESS\n'

this.onRunStart = () => {
this._browsers = []
}

this.onBrowserStart = (browser) => {
this._browsers.push(browser)
}

this.renderBrowser = (browser) => {
const results = browser.lastResult
const totalExecuted = results.success + results.failed
let msg = `${browser}: Executed ${totalExecuted} of ${results.total}`

if (results.failed) {
msg += util.format(this.X_FAILED, results.failed)
}

if (results.skipped) {
msg += ` (skipped ${results.skipped})`
}

if (browser.isConnected) {
if (results.disconnected) {
msg += this.FINISHED_DISCONNECTED
} else if (results.error) {
msg += this.FINISHED_ERROR
} else if (!results.failed) {
msg += this.FINISHED_SUCCESS
}

msg += ` (${helper.formatTimeInterval(results.totalTime)} / ${helper.formatTimeInterval(results.netTime)})`
}

return msg
}

this.write = function () {
const msg = util.format.apply(null, Array.prototype.slice.call(arguments))
