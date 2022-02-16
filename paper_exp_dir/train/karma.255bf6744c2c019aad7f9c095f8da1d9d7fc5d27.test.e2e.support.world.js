const fs = require('fs')
const vm = require('vm')
const path = require('path')
const hasher = require('crypto').createHash
const mkdirp = require('mkdirp')
const _ = require('lodash')
const { setWorldConstructor } = require('cucumber')

class World {
constructor () {
this.proxy = require('./proxy')
this.template = _.template(`process.env.CHROME_BIN = require('puppeteer').executablePath(); module.exports = function (config) {\n  config.set(\n    <%= content %>\n  );\n};`)

this.configFile = {
singleRun: true,
reporters: ['dots'],
frameworks: ['jasmine'],
basePath: __dirname,
