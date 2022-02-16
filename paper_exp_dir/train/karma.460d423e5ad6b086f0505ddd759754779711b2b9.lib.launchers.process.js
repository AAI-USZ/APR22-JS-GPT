var path = require('path')
var log = require('../logger').create('launcher')
var env = process.env

var ProcessLauncher = function (spawn, tempDir, timer, processKillTimeout) {
var self = this
var onExitCallback
var killTimeout = processKillTimeout || 2000

var streamedOutputs = {
stdout: '',
stderr: ''
}

this._tempDir = tempDir.getPath('/karma-' + this.id.toString())

this.on('start', function (url) {
tempDir.create(self._tempDir)
self._start(url)
})
