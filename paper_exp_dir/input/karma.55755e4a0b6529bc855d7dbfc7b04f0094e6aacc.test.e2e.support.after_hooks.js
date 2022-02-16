module.exports = function afterHooks () {
var running = this.child != null && typeof this.child.kill === 'function'

if (running) {
this.child.kill()
this.child = null
}
