const cucumber = require('cucumber')
const fs = require('fs')
const path = require('path')
const ref = require('child_process')
const exec = ref.exec
const spawn = ref.spawn
const rimraf = require('rimraf')
const stopper = require('../../../lib/stopper')

cucumber.defineSupportCode((a) => {
const When = a.When
const Then = a.Then
const Given = a.Given
const defineParameterType = a.defineParameterType

const baseDir = fs.realpathSync(path.join(__dirname, '/../../..'))
const tmpDir = path.join(baseDir, 'tmp', 'sandbox')
const tmpConfigFile = 'karma.conf.js'
let cleansingNeeded = true
let additionalArgs = []

function cleanseIfNeeded () {
if (cleansingNeeded) {
try {
rimraf.sync(tmpDir)
} catch (e) {
}

cleansingNeeded = false

return cleansingNeeded
}
}

function execKarma (command, level, proxyPort, proxyPath, callback) {
level = level || 'warn'

const startProxy = (done) => {
if (proxyPort) {
this.proxy.start(proxyPort, proxyPath, done)
} else {
done()
}
}

startProxy((err) => {
if (err) {
return callback.fail(err)
}

this.writeConfigFile(tmpDir, tmpConfigFile, (err, hash) => {
if (err) {
return callback.fail(new Error(err))
}
const configFile = path.join(tmpDir, hash + '.' + tmpConfigFile)
const runtimePath = path.join(baseDir, 'bin', 'karma')

const executor = (done) => {
const cmd = runtimePath + ' ' + command + ' --log-level ' + level + ' ' + configFile + ' ' + additionalArgs

return exec(cmd, {
cwd: baseDir
}, done)
}

const runOut = command === 'runOut'
if (command === 'run' || command === 'runOut') {
let isRun = false
this.child = spawn('' + runtimePath, ['start', '--log-level', 'warn', configFile])
const done = () => {
cleansingNeeded = true
this.child && this.child.kill()
callback()
}

this.child.on('error', (error) => {
