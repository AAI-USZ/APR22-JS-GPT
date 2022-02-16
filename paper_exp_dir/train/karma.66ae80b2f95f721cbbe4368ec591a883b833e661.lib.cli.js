var path = require('path')
var optimist = require('optimist')
var fs = require('graceful-fs')
var spawn = require('child_process').spawn

var Server = require('./server')
var helper = require('./helper')
var constant = require('./constants')

var processArgs = function (argv, options, fs, path) {
if (argv.help) {
console.log(optimist.help())
process.exit(0)
