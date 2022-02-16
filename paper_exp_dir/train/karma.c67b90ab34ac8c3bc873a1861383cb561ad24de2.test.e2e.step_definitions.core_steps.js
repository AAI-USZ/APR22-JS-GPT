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
