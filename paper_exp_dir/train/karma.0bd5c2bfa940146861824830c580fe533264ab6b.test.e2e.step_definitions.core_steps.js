const { defineParameterType, Given, Then, When } = require('cucumber')
const fs = require('fs')
const path = require('path')
const { exec, spawn } = require('child_process')
const stopper = require('../../../lib/stopper')

let additionalArgs = []

function execKarma (command, level, callback) {
level = level || 'warn'

this.writeConfigFile()

const configFile = this.configFile
const runtimePath = this.karmaExecutable
