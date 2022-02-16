const http = require('http')
const cfg = require('./config')
const logger = require('./logger')
const helper = require('./helper')

exports.stop = function (cliOptionsOrConfig, done) {
cliOptionsOrConfig = cliOptionsOrConfig || {}
const log = logger.create('stopper')
done = helper.isFunction(done) ? done : process.exit

let config
if (cliOptionsOrConfig instanceof cfg.Config) {
config = cliOptionsOrConfig
} else {
logger.setupFromConfig({
