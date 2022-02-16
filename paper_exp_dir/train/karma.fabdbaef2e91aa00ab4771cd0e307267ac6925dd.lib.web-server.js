var fs = require('fs')
var http = require('http')
var path = require('path')
var connect = require('connect')

var helper = require('./helper')

var common = require('./middleware/common')
var runnerMiddleware = require('./middleware/runner')
var stripHostMiddleware = require('./middleware/strip_host')
var karmaMiddleware = require('./middleware/karma')
var sourceFilesMiddleware = require('./middleware/source_files')
var proxyMiddleware = require('./middleware/proxy')

var log = require('./logger').create('web-server')

