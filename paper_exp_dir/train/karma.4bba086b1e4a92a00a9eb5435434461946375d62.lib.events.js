var events = require('events')
var util = require('util')

var helper = require('./helper')

var bindAllEvents = function (object, context) {
context = context || this

var bindMethod = function (method) {
context.on(helper.camelToSnake(method.substr(2)), function () {
var args = Array.prototype.slice.call(arguments, 0)
args.push(context)
