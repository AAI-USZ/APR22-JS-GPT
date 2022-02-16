var Promise = require('bluebird')
var EventEmitter = require('events').EventEmitter
var mocks = require('mocks')
var proxyquire = require('proxyquire')
var pathLib = require('path')
var _ = require('lodash')

var helper = require('../../lib/helper')
var config = require('../../lib/config')

