var {defineSupportCode} = require('cucumber')

defineSupportCode(function ({defineParameterType, Given, Then, When}) {
var fs = require('fs')
var path = require('path')
var ref = require('child_process')
var exec = ref.exec
var spawn = ref.spawn
var rimraf = require('rimraf')
var stopper = require('../../../lib/stopper')

var baseDir = fs.realpathSync(path.join(__dirname, '/../../..'))
var tmpDir = path.join(baseDir, 'tmp', 'sandbox')
var tmpConfigFile = 'karma.conf.js'
var cleansingNeeded = true
var additionalArgs = []

var cleanseIfNeeded = function () {
if (cleansingNeeded) {
try {
rimraf.sync(tmpDir)
} catch (e) {
}

cleansingNeeded = false

return cleansingNeeded
}
}

function execKarma (command, level, proxyPort, proxyPath, callback) {
level = level || 'warn'

var startProxy = (done) => {
if (proxyPort) {
this.proxy.start(proxyPort, proxyPath, done)
} else {
done()
}
}
