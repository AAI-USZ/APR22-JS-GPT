'use strict'

const http = require('http')

const constant = require('./constants')
const EventEmitter = require('events').EventEmitter
const helper = require('./helper')
const cfg = require('./config')
const logger = require('./logger')
const log = logger.create('runner')

function parseExitCode (buffer, defaultExitCode, failOnEmptyTestSuite) {
const tailPos = buffer.length - Buffer.byteLength(constant.EXIT_CODE) - 2

if (tailPos < 0) {
return { exitCode: defaultExitCode, buffer }
}

const tail = buffer.slice(tailPos)
const tailStr = tail.toString()
if (tailStr.substr(0, tailStr.length - 2) === constant.EXIT_CODE) {
const emptyInt = parseInt(tailStr.substr(-2, 1), 10)
let exitCode = parseInt(tailStr.substr(-1), 10)
if (failOnEmptyTestSuite === false && emptyInt === 0) {
log.warn('Test suite was empty.')
exitCode = 0
}
return { exitCode, buffer: buffer.slice(0, tailPos) }
}

return { exitCode: defaultExitCode, buffer }
}


function run (cliOptionsOrConfig, done) {
cliOptionsOrConfig = cliOptionsOrConfig || {}
done = helper.isFunction(done) ? done : process.exit

let config
if (cliOptionsOrConfig instanceof cfg.Config) {
config = cliOptionsOrConfig
} else {
logger.setupFromConfig({
colors: cliOptionsOrConfig.colors,
