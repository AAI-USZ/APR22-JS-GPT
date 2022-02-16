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
await waitForCondition(
() => this.backgroundProcess.stdout.includes(expectedOutput),
5000,
() => new Error(
'Expected server output to contain the above text within 5000ms, but got:\n\n' +
this.backgroundProcess.stdout
)
)
})

