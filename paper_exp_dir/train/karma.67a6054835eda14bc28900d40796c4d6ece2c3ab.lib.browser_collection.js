var EXECUTING = require('./browser').STATE_EXECUTING
var Result = require('./browser_result')

var Collection = function (emitter, browsers) {
browsers = browsers || []

this.add = function (browser) {
browsers.push(browser)
emitter.emit('browsers_change', this)
}

this.remove = function (browser) {
var index = browsers.indexOf(browser)
