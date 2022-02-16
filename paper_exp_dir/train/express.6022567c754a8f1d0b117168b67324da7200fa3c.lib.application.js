

'use strict';



var finalhandler = require('finalhandler');
var Router = require('./router');
var methods = require('methods');
var middleware = require('./middleware/init');
var query = require('./middleware/query');
var debug = require('debug')('express:application');
var View = require('./view');
var http = require('http');
var compileETag = require('./utils').compileETag;
var compileQueryParser = require('./utils').compileQueryParser;
var compileTrust = require('./utils').compileTrust;
var deprecate = require('depd')('express');
var flatten = require('array-flatten');
var merge = require('utils-merge');
var resolve = require('path').resolve;
var setPrototyeOf = require('setprototypeof')
var slice = Array.prototype.slice;



var app = exports = module.exports = {};



var trustProxyDefaultSymbol = '@@symbol:trust_proxy_default';



app.init = function init() {
this.cache = {};
this.engines = {};
