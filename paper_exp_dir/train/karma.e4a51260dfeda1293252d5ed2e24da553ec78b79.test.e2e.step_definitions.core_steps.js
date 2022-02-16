const { defineParameterType, Given, Then, When } = require('cucumber')
const fs = require('fs')
const path = require('path')
const { exec, spawn } = require('child_process')
const stopper = require('../../../lib/stopper')

let additionalArgs = []

function execKarma (command, level, callback) {
level = level || 'warn'

const configFile = this.configFile
const runtimePath = this.karmaExecutable
const baseDir = this.workDir

const executor = (done) => {
const cmd = runtimePath + ' ' + command + ' --log-level ' + level + ' ' + configFile + ' ' + additionalArgs

return exec(cmd, {
cwd: baseDir
}, done)
