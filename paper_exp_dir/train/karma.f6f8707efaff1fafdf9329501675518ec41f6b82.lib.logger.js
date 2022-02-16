





var log4js = require('log4js')
var helper = require('./helper')
var constant = require('./constants')














var setup = function (level, colors, appenders) {

var pattern = colors ? constant.COLOR_PATTERN : constant.NO_COLOR_PATTERN
if (appenders) {

if (appenders['map']) {
if (appenders.length === 0) {
appenders = [constant.CONSOLE_APPENDER]
}
