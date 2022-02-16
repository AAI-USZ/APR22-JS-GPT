


var Route = require('./route')
, utils = require('../utils')
, debug = require('debug')('express:router')
, parse = require('connect').utils.parseUrl;



exports = module.exports = Router;



var methods = exports.methods = require('./methods');


