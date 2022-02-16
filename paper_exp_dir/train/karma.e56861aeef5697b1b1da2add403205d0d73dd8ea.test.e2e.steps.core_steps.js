var {defineSupportCode} = require('cucumber')

defineSupportCode(function ({defineParameterType, Given, Then, When}) {
var fs = require('fs')
var path = require('path')
var ref = require('child_process')
var exec = ref.exec
var spawn = ref.spawn
var rimraf = require('rimraf')
var stopper = require('../../../lib/stopper')
