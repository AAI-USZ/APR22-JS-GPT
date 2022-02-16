

var Route = require('./route')
, utils = require('../utils')
, methods = require('methods')
, debug = require('debug')('express:router')
, parse = require('connect').utils.parseUrl;



exports = module.exports = Router;



function Router(options) {
options = options || {};
var self = this;
this.map = {};
