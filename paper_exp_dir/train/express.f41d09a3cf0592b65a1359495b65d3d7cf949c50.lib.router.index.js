

var Route = require('./route')
, utils = require('../utils')
, methods = require('methods')
, debug = require('debug')('express:router')
, parse = require('connect').utils.parseUrl;



exports = module.exports = Router;



function Router(options) {
options = options || {};
var self = this;

self.params = {};
self._params = [];
self.caseSensitive = options.caseSensitive;
self.strict = options.strict;
self.stack = [];

self.middleware = self.handle.bind(self);
}



Router.prototype.param = function(name, fn){

if ('function' == typeof name) {
this._params.push(name);
return;
}


var params = this._params
, len = params.length
, ret;

if (name[0] === ':') {
name = name.substr(1);
