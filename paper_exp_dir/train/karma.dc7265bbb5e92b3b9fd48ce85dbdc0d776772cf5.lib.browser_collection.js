'use strict'

const Result = require('./browser_result')

class BrowserCollection {
constructor (emitter, browsers) {
this.browsers = browsers || []
this.emitter = emitter
}

add (browser) {
this.browsers.push(browser)
