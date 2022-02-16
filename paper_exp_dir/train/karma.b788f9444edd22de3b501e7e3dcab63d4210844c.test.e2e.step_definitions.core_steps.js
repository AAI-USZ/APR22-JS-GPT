const { defineParameterType, Given, Then, When } = require('cucumber')
const fs = require('fs')
const path = require('path')
const { exec, spawn } = require('child_process')
const rimraf = require('rimraf')
const stopper = require('../../../lib/stopper')

const baseDir = fs.realpathSync(path.join(__dirname, '/../../..'))
const tmpDir = path.join(baseDir, 'tmp', 'sandbox')
const tmpConfigFile = 'karma.conf.js'
let cleansingNeeded = true
let additionalArgs = []

function cleanseIfNeeded () {
if (cleansingNeeded) {
try {
rimraf.sync(tmpDir)
} catch (e) {
}

cleansingNeeded = false

return cleansingNeeded
}
}

function execKarma (command, level, callback) {
level = level || 'warn'

this.writeConfigFile(tmpDir, tmpConfigFile, (err, hash) => {
if (err) {
return callback.fail(new Error(err))
}
const configFile = path.join(tmpDir, hash + '.' + tmpConfigFile)
const runtimePath = path.join(baseDir, 'bin', 'karma')

const executor = (done) => {
const cmd = runtimePath + ' ' + command + ' --log-level ' + level + ' ' + configFile + ' ' + additionalArgs
