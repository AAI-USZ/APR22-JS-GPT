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
