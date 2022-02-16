

var _ = require('lodash')
var path = require('path')
var helper = require('../helper')
var log = require('../logger').create()
var constant = require('../constants')
var json = require('body-parser').json()


var createRunnerMiddleware = function (emitter, fileList, capturedBrowsers, reporter, executor,
protocol,   hostname,
port,   urlRoot, config) {
