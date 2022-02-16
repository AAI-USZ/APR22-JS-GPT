

var Route = require('./route')
, Layer = require('./layer')
, utils = require('../utils')
, methods = require('methods')
, debug = require('debug')('express:router')
, parseUrl = utils.parseUrl;



exports = module.exports = Router;



function Router(options) {
options = options || {};
