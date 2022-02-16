





let log4js = require('log4js')
const helper = require('./helper')
const constant = require('./constants')














function setup (level, colors, appenders) {

const pattern = colors ? constant.COLOR_PATTERN : constant.NO_COLOR_PATTERN
if (appenders) {

if (appenders.length === 0) {
appenders = [constant.CONSOLE_APPENDER]
}
const v1Appenders = appenders
appenders = {}
v1Appenders.forEach(function (appender, index) {
if (appender.type === 'console') {
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
