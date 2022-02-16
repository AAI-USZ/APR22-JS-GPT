var {defineSupportCode} = require('cucumber')

defineSupportCode(function ({After}) {
After(function (scenario, callback) {
var running = this.child != null && typeof this.child.kill === 'function'

if (running) {
this.child.kill()
this.child = null
}
