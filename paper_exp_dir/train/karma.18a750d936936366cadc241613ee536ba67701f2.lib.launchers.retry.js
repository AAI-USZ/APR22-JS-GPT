const log = require('../logger').create('launcher')

function RetryLauncher (retryLimit) {
this._retryLimit = retryLimit

this.on('done', () => {
if (!this.error) {
return
}

if (this._retryLimit > 0) {
const attempt = retryLimit - this._retryLimit + 1
log.info('Trying to start %s again (%d/%d).', this.name, attempt, retryLimit)
this.restart()
