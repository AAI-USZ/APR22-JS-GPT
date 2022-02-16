const BaseReporter = require('./base')

function ProgressReporter (formatError, reportSlow, useColors, browserConsoleLogOptions) {
BaseReporter.call(this, formatError, reportSlow, useColors, browserConsoleLogOptions)

this.EXCLUSIVELY_USE_COLORS = false
this._browsers = []

this.writeCommonMsg = function (msg) {
this.write(this._remove() + msg + this._render())
}

this.specSuccess = function () {
this.write(this._refresh())
}

this.onBrowserComplete = function () {
this.write(this._refresh())
}

this.onRunStart = function () {
this._browsers = []
this._isRendered = false
}

this.onBrowserStart = function (browser) {
this._browsers.push(browser)

if (this._isRendered) {
this.write('\n')
}

this.write(this._refresh())
}

this._remove = function () {
if (!this._isRendered) {
return ''
}

let cmd = ''
this._browsers.forEach(function () {
cmd += '\x1B[1A' + '\x1B[2K'
})

this._isRendered = false

return cmd
}

this._render = function () {
this._isRendered = true

return this._browsers.map(this.renderBrowser).join('\n') + '\n'
}

this._refresh = function () {
return this._remove() + this._render()
}
}


module.exports = ProgressReporter
