const cucumber = require('cucumber')

cucumber.defineSupportCode((a) => {
a.After(function (scenario, callback) {
const running = this.child != null && typeof this.child.kill === 'function'

if (running) {
this.child.kill()
this.child = null
}


this.proxy.stop(callback)
})
})
