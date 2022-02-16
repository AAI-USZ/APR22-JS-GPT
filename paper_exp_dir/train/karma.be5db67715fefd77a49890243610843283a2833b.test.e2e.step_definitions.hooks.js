const { After } = require('cucumber')

After(function (scenario, callback) {
const running = this.child != null && typeof this.child.kill === 'function'


this.proxy.stop(() => {
if (running) {
this.child.kill()
this.child = null
}
callback()
