const fs = require('fs')
const vm = require('vm')
const path = require('path')
const hasher = require('crypto').createHash
const mkdirp = require('mkdirp')
const _ = require('lodash')
const cucumber = require('cucumber')

function World () {
this.proxy = require('./proxy')
this.template = _.template(`process.env.CHROME_BIN = require('puppeteer').executablePath(); module.exports = function (config) {\n  config.set(\n    <%= content %>\n  );\n};`)

this.configFile = {
singleRun: true,
reporters: ['dots'],
frameworks: ['jasmine'],
basePath: __dirname,
colors: false,
__dirname: __dirname,
_resolve: function (name) {
