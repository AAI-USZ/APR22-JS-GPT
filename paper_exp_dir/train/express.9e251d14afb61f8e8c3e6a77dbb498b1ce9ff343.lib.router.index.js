



var Route = require('./route')
, utils = require('../utils')
, debug = require('debug')('express:router')
, parse = require('url').parse;



exports = module.exports = Router;



var methods = exports.methods = require('./methods');



function Router(options) {
options = options || {};
