var fs = require('graceful-fs')
var util = require('util')
var path = require('path')

var JS_TEMPLATE_PATH = path.join(__dirname, '/../../config.tpl.js')
var COFFEE_TEMPLATE_PATH = path.join(__dirname, '/../../config.tpl.coffee')
var JS_REQUIREJS_TEMPLATE_PATH = path.join(__dirname, '/../../requirejs.config.tpl.js')
var COFFEE_REQUIREJS_TEMPLATE_PATH = path.join(__dirname, '/../../requirejs.config.tpl.coffee')
var COFFEE_REGEXP = /\.coffee$/
var LIVE_TEMPLATE_PATH = path.join(__dirname, '/../../config.tpl.ls')
var LIVE_REGEXP = /\.ls$/

