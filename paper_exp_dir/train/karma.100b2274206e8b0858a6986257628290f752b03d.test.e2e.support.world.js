const { exec, spawn } = require('child_process')
const fs = require('fs')
const vm = require('vm')
const path = require('path')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const { setWorldConstructor } = require('cucumber')
const Proxy = require('./proxy')

class World {
constructor () {
this.proxy = new Proxy()


this.workDir = fs.realpathSync(__dirname)


this.sandboxDir = path.join(this.workDir, 'sandbox')


this.configFile = path.join(this.sandboxDir, 'karma.conf.js')


this.karmaExecutable = fs.realpathSync(path.join(__dirname, '../../../bin/karma'))

this.config = {
singleRun: true,
reporters: ['dots'],
frameworks: ['jasmine'],
basePath: this.workDir,
colors: false,
logLevel: 'warn',







_resolve: (name) => path.resolve(this.workDir, name)
}

this.lastRun = {
error: null,
stdout: '',
stderr: ''
