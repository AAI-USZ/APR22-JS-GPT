var readline = require('readline')
var path = require('path')
var glob = require('glob')
var mm = require('minimatch')
var exec = require('child_process').exec

var helper = require('./helper')
var logger = require('./logger')

var log = logger.create('init')

var StateMachine = require('./init/state_machine')
var COLOR_SCHEME = require('./init/color_schemes')
var formatters = require('./init/formatters')






var logQueue = []
var printLogQueue = function () {
while (logQueue.length) {
