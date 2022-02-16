const fs = require('fs')
const vm = require('vm')
const path = require('path')
const hasher = require('crypto').createHash
const mkdirp = require('mkdirp')
const _ = require('lodash')
const { setWorldConstructor } = require('cucumber')
const Proxy = require('./proxy')

class World {
constructor () {
this.proxy = new Proxy()
this.template = _.template(`process.env.CHROME_BIN = require('puppeteer').executablePath(); module.exports = function (config) {\n  config.set(\n    <%= content %>\n  );\n};`)

this.configFile = {
singleRun: true,
reporters: ['dots'],
