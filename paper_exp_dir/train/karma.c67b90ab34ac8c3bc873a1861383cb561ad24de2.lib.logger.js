





let log4js = require('log4js')
const helper = require('./helper')
const constant = require('./constants')














function setup (level, colors, appenders) {

const pattern = colors ? constant.COLOR_PATTERN : constant.NO_COLOR_PATTERN
if (appenders) {

if (appenders['map']) {
if (appenders.length === 0) {
appenders = [constant.CONSOLE_APPENDER]
}
const v1Appenders = appenders
appenders = {}
v1Appenders.forEach(function (appender, index) {
if (appender.type === 'console') {
appenders['console'] = appender
if (helper.isDefined(appender.layout) && appender.layout.type === 'pattern') {
appender.layout.pattern = pattern
}
} else {
appenders[index + ''] = appender
}
return appender
})
}
} else {
appenders = {'console': constant.CONSOLE_APPENDER}
}

log4js.configure({
appenders: appenders,
categories: {
'default': {
'appenders': Object.keys(appenders),
'level': level
}
}
})
}











function setupFromConfig (config, appenders) {
let useColors = true
let logLevel = constant.LOG_INFO

if (helper.isDefined(config.colors)) {
useColors = config.colors
}

if (helper.isDefined(config.logLevel)) {
logLevel = config.logLevel
}
setup(logLevel, useColors, appenders)
}

const loggerCache = {}






function create (name, level) {
name = name || 'karma'
let logger
if (loggerCache.hasOwnProperty(name)) {
logger = loggerCache[name]
} else {
logger = log4js.getLogger(name)
loggerCache[name] = logger
}
if (helper.isDefined(level)) {
logger.setLevel(level)
}
return logger
}



exports.create = create
exports.setup = setup
exports.setupFromConfig = setupFromConfig
exports._rebindLog4js4testing = function (mockLog4js) {
log4js = mockLog4js
}
