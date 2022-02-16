'use strict'

const EXECUTING = require('./browser').STATE_EXECUTING
const Result = require('./browser_result')

class BrowserCollection {
constructor (emitter, browsers) {
this.browsers = browsers || []
this.emitter = emitter
}

add (browser) {
