var util = require('util')

var helper = require('../helper')

var BaseReporter = function (formatError, reportSlow, adapter) {
this.adapters = [adapter || process.stdout.write.bind(process.stdout)]

this.onRunStart = function () {
this._browsers = []
}

this.onBrowserStart = function (browser) {
