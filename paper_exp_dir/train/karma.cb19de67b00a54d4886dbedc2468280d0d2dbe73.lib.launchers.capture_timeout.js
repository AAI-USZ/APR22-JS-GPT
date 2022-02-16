const log = require('../logger').create('launcher')


function CaptureTimeoutLauncher (timer, captureTimeout) {
if (!captureTimeout) {
return
}

let pendingTimeoutId = null

this.on('start', () => {
pendingTimeoutId = timer.setTimeout(() => {
pendingTimeoutId = null
if (this.state !== this.STATE_BEING_CAPTURED) {
return
}

log.warn('%s have not captured in %d ms, killing.', this.name, captureTimeout)
