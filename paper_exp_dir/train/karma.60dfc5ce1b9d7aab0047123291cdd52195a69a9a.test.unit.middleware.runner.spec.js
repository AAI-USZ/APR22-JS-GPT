var path = require('path')
var EventEmitter = require('events').EventEmitter
var mocks = require('mocks')
var Promise = require('bluebird')
var _ = require('lodash')

var Browser = require('../../../lib/browser')
var BrowserCollection = require('../../../lib/browser_collection')
var MultReporter = require('../../../lib/reporters/multi')
var createRunnerMiddleware = require('../../../lib/middleware/runner').create
