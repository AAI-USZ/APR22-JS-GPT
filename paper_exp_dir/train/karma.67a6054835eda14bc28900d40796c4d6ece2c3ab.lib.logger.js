





var log4js = require('log4js')
var helper = require('./helper')
var constant = require('./constants')


var LogWrapper = function (name, level) {
this.logger = log4js.getLogger(name)
this.logger.setLevel(level)
}
var levels = ['error', 'warn', 'info', 'debug']

levels.forEach(function (level) {
