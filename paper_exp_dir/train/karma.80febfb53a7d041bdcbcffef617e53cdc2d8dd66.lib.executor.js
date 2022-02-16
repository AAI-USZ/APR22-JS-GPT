'use strict'

const log = require('./logger').create()

class Executor {
constructor (capturedBrowsers, config, emitter) {
this.capturedBrowsers = capturedBrowsers
this.config = config
this.emitter = emitter

this.executionScheduled = false
this.errorsScheduled = []
this.pendingCount = 0
this.runningBrowsers = null

this.emitter.on('run_complete', () => this.onRunComplete())
this.emitter.on('browser_complete', () => this.onBrowserComplete())
}

schedule () {
if (this.capturedBrowsers.length === 0) {
