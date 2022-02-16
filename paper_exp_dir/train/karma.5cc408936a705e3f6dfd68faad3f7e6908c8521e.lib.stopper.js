const http = require('http')
const cfg = require('./config')
const logger = require('./logger')
const helper = require('./helper')

exports.stop = function (config, done) {
config = config || {}
logger.setupFromConfig(config)
const log = logger.create('stopper')
done = helper.isFunction(done) ? done : process.exit
config = cfg.parseConfig(config.configFile, config)

