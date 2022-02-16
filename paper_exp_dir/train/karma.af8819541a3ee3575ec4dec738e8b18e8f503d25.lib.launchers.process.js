var path = require('path')
var log = require('../logger').create('launcher')
var env = process.env

var ProcessLauncher = function (spawn, tempDir, timer) {
var self = this
var onExitCallback
var killTimeout = 2000

this._tempDir = tempDir.getPath('/karma-' + this.id.toString())

this.on('start', function (url) {
tempDir.create(self._tempDir)
self._start(url)
})

this.on('kill', function (done) {
if (!self._process) {
return process.nextTick(done)
}

onExitCallback = done
self._process.kill()
self._killTimer = timer.setTimeout(self._onKillTimeout, killTimeout)
})

this._start = function (url) {
self._execCommand(self._getCommand(), self._getOptions(url))
}

this._getCommand = function () {
return env[self.ENV_CMD] || self.DEFAULT_CMD[process.platform]
}

this._getOptions = function (url) {
return [url]
}


this._normalizeCommand = function (cmd) {
if (cmd.charAt(0) === cmd.charAt(cmd.length - 1) && '\'`"'.indexOf(cmd.charAt(0)) !== -1) {
cmd = cmd.substring(1, cmd.length - 1)
log.warn('The path should not be quoted.\n  Normalized the path to %s', cmd)
}

return path.normalize(cmd)
}

this._execCommand = function (cmd, args) {
if (!cmd) {
log.error('No binary for %s browser on your platform.\n  ' +
'Please, set "%s" env variable.', self.name, self.ENV_CMD)


self._retryLimit = -1

return self._clearTempDirAndReportDone('no binary')
}

cmd = this._normalizeCommand(cmd)

log.debug(cmd + ' ' + args.join(' '))
self._process = spawn(cmd, args)

var errorOutput = ''

self._process.on('exit', function (code) {
self._onProcessExit(code, errorOutput)
})

self._process.on('error', function (err) {
if (err.code === 'ENOENT') {
self._retryLimit = -1
errorOutput = 'Can not find the binary ' + cmd + '\n\t' +
'Please set env variable ' + self.ENV_CMD
} else {
errorOutput += err.toString()
}
})
}

this._onProcessExit = function (code, errorOutput) {
log.debug('Process %s exited with code %d', self.name, code)

var error = null

if (self.state === self.STATE_BEING_CAPTURED) {
log.error('Cannot start %s\n\t%s', self.name, errorOutput)
error = 'cannot start'
}
