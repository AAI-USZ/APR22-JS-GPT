var http = require('http')

var constant = require('./constants')
var helper = require('./helper')
var cfg = require('./config')
var logger = require('./logger')
var log = logger.create('runner')

var parseExitCode = function (buffer, defaultCode, failOnEmptyTestSuite) {
var tailPos = buffer.length - Buffer.byteLength(constant.EXIT_CODE) - 2

if (tailPos < 0) {
return defaultCode
}

