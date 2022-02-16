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


var tail = buffer.slice(tailPos)
var tailStr = tail.toString()
if (tailStr.substr(0, tailStr.length - 2) === constant.EXIT_CODE) {
tail.fill('\x00')
var emptyInt = parseInt(tailStr.substr(-2, 1), 10)
var exitCode = parseInt(tailStr.substr(-1), 10)
if (failOnEmptyTestSuite === false && emptyInt === 0) {
log.warn('Test suite was empty.')
return 0
}
return exitCode
}

return defaultCode
}


exports.run = function (config, done) {
logger.setupFromConfig(config)

done = helper.isFunction(done) ? done : process.exit
config = cfg.parseConfig(config.configFile, config)

var exitCode = 1
var options = {
hostname: config.hostname,
path: config.urlRoot + 'run',
port: config.port,
