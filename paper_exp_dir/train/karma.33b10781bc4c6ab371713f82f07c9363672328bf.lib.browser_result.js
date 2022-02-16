'use strict'

class BrowserResult {
constructor () {
this.startTime = Date.now()

this.total = this.skipped = this.failed = this.success = 0
this.netTime = this.totalTime = 0
this.disconnected = this.error = false
}

totalTimeEnd () {
