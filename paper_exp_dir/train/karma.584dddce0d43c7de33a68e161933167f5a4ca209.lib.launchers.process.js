const path = require('path')
const log = require('../logger').create('launcher')
const env = process.env

function ProcessLauncher (spawn, tempDir, timer, processKillTimeout) {
const self = this
let onExitCallback
const killTimeout = processKillTimeout || 2000

const streamedOutputs = {
stdout: '',
stderr: ''
}

this._tempDir = tempDir.getPath(`/karma-${this.id.toString()}`)

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
if (cmd.charAt(0) === cmd.charAt(cmd.length - 1) && '\'`"'.includes(cmd.charAt(0))) {
cmd = cmd.substring(1, cmd.length - 1)
log.warn(`The path should not be quoted.\n  Normalized the path to ${cmd}`)
}

return path.normalize(cmd)
}

this._onStdout = function (data) {
streamedOutputs.stdout += data
}

this._onStderr = function (data) {
streamedOutputs.stderr += data
}

this._execCommand = function (cmd, args) {
if (!cmd) {
log.error(`No binary for ${self.name} browser on your platform.\n  Please, set "${self.ENV_CMD}" env variable.`)


self._retryLimit = -1

return self._clearTempDirAndReportDone('no binary')
}

cmd = this._normalizeCommand(cmd)

log.debug(cmd + ' ' + args.join(' '))
self._process = spawn(cmd, args)
let errorOutput = ''

self._process.stdout.on('data', self._onStdout)

self._process.stderr.on('data', self._onStderr)

self._process.on('exit', function (code) {
self._onProcessExit(code, errorOutput)
})

self._process.on('error', function (err) {
if (err.code === 'ENOENT') {
self._retryLimit = -1
errorOutput = `Can not find the binary ${cmd}\n\tPlease set env variable ${self.ENV_CMD}`
} else if (err.code === 'EACCES') {
self._retryLimit = -1
errorOutput = `Permission denied accessing the binary ${cmd}\n\tMaybe it's a directory?`
} else {
errorOutput += err.toString()
}
})

self._process.stderr.on('data', function (errBuff) {
errorOutput += errBuff.toString()
