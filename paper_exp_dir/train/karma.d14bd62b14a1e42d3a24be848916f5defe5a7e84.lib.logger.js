





var log4js = require('log4js')
var helper = require('./helper')
var constant = require('./constants')













var setup = function (level, colors, appenders) {

var pattern = colors ? constant.COLOR_PATTERN : constant.NO_COLOR_PATTERN


appenders = helper.isDefined(appenders) ? appenders : [constant.CONSOLE_APPENDER]

appenders = appenders.map(function (appender) {
if (appender.type === 'console') {
if (helper.isDefined(appender.layout) && appender.layout.type === 'pattern') {
appender.layout.pattern = pattern
}
}
return appender
})


log4js.setGlobalLogLevel(level)
log4js.configure({
appenders: appenders
})
}










var setupFromConfig = function (config, appenders) {
var useColors = true
var logLevel = constant.LOG_INFO

if (helper.isDefined(config.colors)) {
useColors = config.colors
}
