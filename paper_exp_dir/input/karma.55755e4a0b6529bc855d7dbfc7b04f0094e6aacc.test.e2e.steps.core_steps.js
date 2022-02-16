module.exports = function coreSteps () {
var fs = require('fs')
var path = require('path')
var ref = require('child_process')
var exec = ref.exec
var spawn = ref.spawn
var rimraf = require('rimraf')
var stopper = require('../../../lib/stopper')

this.World = require('../support/world').World
require('../support/after_hooks').call(this)

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

this.Given(/^a configuration with:$/, function (fileContent, callback) {
cleanseIfNeeded()
this.addConfigContent(fileContent)
return callback()
})

this.Given(/^command line arguments of: "([^"]*)"$/, function (args, callback) {
additionalArgs = args
return callback()
})

this.When(/^I stop a server programmatically/, function (callback) {
var _this = this
setTimeout(function () {
stopper.stop(_this.configFile, function (exitCode) {
_this.stopperExitCode = exitCode
})
callback()
}, 1000)
})

this.When(/^I start a server in background/, function (callback) {
this.writeConfigFile(tmpDir, tmpConfigFile, (function (_this) {
return function (err, hash) {
if (err) {
return callback.fail(new Error(err))
}
var configFile = path.join(tmpDir, hash + '.' + tmpConfigFile)
var runtimePath = path.join(baseDir, 'bin', 'karma')
_this.child = spawn('' + runtimePath, ['start', '--log-level', 'debug', configFile])
_this.child.stdout.on('data', function () {
callback()
callback = function () {
}
})
_this.child.on('exit', function (exitCode) {
_this.childExitCode = exitCode
})
}
})(this))
})

