const { defineParameterType, Given, Then, When } = require('cucumber')
const fs = require('fs')
const path = require('path')
const { waitForCondition } = require('./utils')
const stopper = require('../../../lib/stopper')

Given('a default configuration', function () {
this.writeConfigFile()
})

Given('a configuration with:', function (fileContent) {
this.updateConfig(fileContent)
this.writeConfigFile()
})

Given('a proxy on port {int} that prepends {string} to the base path', async function (proxyPort, proxyPath) {
return this.proxy.start(proxyPort, proxyPath)
})

When('I stop a server programmatically', function (callback) {
setTimeout(() => {
stopper.stop(this.config, (exitCode) => {
this.stopperExitCode = exitCode
callback()
})
}, 1000)
})

When('I start a server in background', async function () {
await this.runBackgroundProcess(['start', '--log-level', 'debug', this.configFile])
})

When('I wait until server output contains:', async function (expectedOutput) {
await waitForCondition(() => this.backgroundProcess.stdout.includes(expectedOutput))
})

defineParameterType({
name: 'command',
regexp: /run|start|init|stop/
})

When('I {command} Karma', async function (command) {
await this.runForegroundProcess(`${command} ${this.configFile}`)
})

When('I {command} Karma with additional arguments: {string}', async function (command, args) {
await this.runForegroundProcess(`${command} ${this.configFile} ${args}`)
})

When('I execute Karma with arguments: {string}', async function (args) {
await this.runForegroundProcess(args)
})

Then(/^it passes with(:? (no\sdebug|like|regexp))?:$/, { timeout: 10 * 1000 }, function (mode, expectedOutput, callback) {
const noDebug = mode === 'no debug'
const like = mode === 'like'
const regexp = mode === 'regexp'
let actualOutput = this.lastRun.stdout
let lines
