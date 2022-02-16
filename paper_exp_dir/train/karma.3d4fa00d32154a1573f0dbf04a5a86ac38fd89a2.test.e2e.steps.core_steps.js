module.exports = function coreSteps () {
var fs = require('fs')
var path = require('path')
var ref = require('child_process')
var exec = ref.exec
var spawn = ref.spawn
var rimraf = require('rimraf')
var stopper = require('../../../lib/stopper')

this.World = require('../support/world').World
require('../support/after_hooks').call(this)

var baseDir = fs.realpathSync(path.join(__dirname, '/../../..'))
var tmpDir = path.join(baseDir, 'tmp', 'sandbox')
var tmpConfigFile = 'karma.conf.js'
var cleansingNeeded = true
var additionalArgs = []
