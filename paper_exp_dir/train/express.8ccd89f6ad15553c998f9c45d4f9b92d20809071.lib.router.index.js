

var Route = require('./route')
, utils = require('../utils')
, debug = require('debug')('express:router')
, parse = require('connect').utils.parseUrl
, methods = require('methods');



exports = module.exports = Router;



function Router(options) {
options = options || {};
