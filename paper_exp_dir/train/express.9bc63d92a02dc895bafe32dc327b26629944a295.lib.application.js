

var mixin = require('utils-merge')
, escapeHtml = require('escape-html')
, Router = require('./router')
, methods = require('methods')
, middleware = require('./middleware')
, debug = require('debug')('express:application')
, View = require('./view')
, http = require('http');



var app = exports = module.exports = {};
