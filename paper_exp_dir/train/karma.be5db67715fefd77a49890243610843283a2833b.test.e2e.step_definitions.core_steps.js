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
