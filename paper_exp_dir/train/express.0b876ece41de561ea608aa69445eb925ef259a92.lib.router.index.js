



var Route = require('./route')
, Collection = require('./collection')
, utils = require('../utils')
, debug = require('debug')('express:routes')
, parse = require('url').parse;



exports = module.exports = Router;



var methods = exports.methods = require('./methods');



function Router(options) {
options = options || {};
var self = this;
