this.When(/^I (run|runOut|start|init|stop) Karma( with log-level ([a-z]+))?( behind a proxy on port ([0-9]*) that prepends '([^']*)' to the base path)?$/, function (command, withLogLevel, level, behindProxy, proxyPort, proxyPath, callback) {
var startProxy = function (done) {
if (behindProxy) {
