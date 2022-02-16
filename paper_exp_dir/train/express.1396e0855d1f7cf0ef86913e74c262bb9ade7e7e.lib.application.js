

var mixin = require('utils-merge')
, escapeHtml = require('escape-html')
, Router = require('./router')
, methods = require('methods')
, middleware = require('./middleware/init')
, query = require('./middleware/query')
, debug = require('debug')('express:application')
, View = require('./view')
, http = require('http');



var app = exports = module.exports = {};



app.init = function(){
this.cache = {};
