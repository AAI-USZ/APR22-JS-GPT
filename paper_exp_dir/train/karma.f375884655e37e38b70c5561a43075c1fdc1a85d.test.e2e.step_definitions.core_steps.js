const { defineParameterType, Given, Then, When } = require('cucumber')
const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')
const { waitForCondition } = require('./utils')
const stopper = require('../../../lib/stopper')

let additionalArgs = []

function execKarma (command, level, callback) {
level = level || 'warn'

const cmd = `${this.karmaExecutable} ${command} --log-level ${level} ${this.configFile} ${additionalArgs}`
exec(cmd, { cwd: this.workDir }, (error, stdout, stderr) => {
