var path = require('path')
var optimist = require('optimist')
var fs = require('graceful-fs')

var Server = require('./server')
var helper = require('./helper')
var constant = require('./constants')

var processArgs = function (argv, options, fs, path) {
if (argv.help) {
console.log(optimist.help())
process.exit(0)
}

if (argv.version) {
console.log('Karma version: ' + constant.VERSION)
process.exit(0)
}


Object.getOwnPropertyNames(argv).forEach(function (name) {
var argumentValue = argv[name]
if (name !== '_' && name !== '$0') {
