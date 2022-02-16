var path = require('path')
var log = require('../logger').create('launcher')
var env = process.env

var ProcessLauncher = function (spawn, tempDir, timer) {
var self = this
var onExitCallback
var killTimeout = 2000

this._tempDir = tempDir.getPath('/karma-' + this.id.toString())

