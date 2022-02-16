#!/usr/bin/env node
'use strict'

var fs = require('fs')
var exec = require('child_process').exec
var path = require('path')


var rimraf = require('./rimraf')

var isWin = !!process.platform.match(/^win/)

var pathTo = function (p) {
return path.resolve(__dirname + '/../' + p)
}

var scriptPath = pathTo('node_modules/grunt-conventional-changelog/lib/validate-commit-msg.js')
var gitHookPath = pathTo('.git/hooks/commit-msg')

var gitHookSetup = function () {
if (fs.existsSync(gitHookPath)) {
fs.unlinkSync(gitHookPath)
console.log('Existing link removed:', gitHookPath)
}

console.log('Adding symbolic link: %s linked to %s', scriptPath, gitHookPath)
try {

fs.mkdirSync(path.dirname(gitHookPath))
} catch (e) {}
fs.symlinkSync(scriptPath, gitHookPath, 'file')
}

var installGruntCli = function (callback) {
console.log('Installing grunt-cli...')

var gcli = exec('npm install -g grunt-cli', function (error) {
if (error !== null) {
console.error('error installing grunt-cli: ' + error)
} else {
callback()
}
