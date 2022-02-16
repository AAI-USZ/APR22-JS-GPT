



var Route = require('./route')
, Collection = require('./collection')
, utils = require('../utils')
, parse = require('url').parse;



exports = module.exports = Router;



var methods = exports.methods = require('./methods');



function Router(options) {
