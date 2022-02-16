var http = require('http')

var cfg = require('./config')
var logger = require('./logger')
var helper = require('./helper')

exports.stop = function (config, done) {
config = config || {}
logger.setupFromConfig(config)
done = helper.isFunction(done) ? done : process.exit
var log = logger.create('stopper')
config = cfg.parseConfig(config.configFile, config)

var options = {
hostname: config.hostname,
path: config.urlRoot + 'stop',
port: config.port,
