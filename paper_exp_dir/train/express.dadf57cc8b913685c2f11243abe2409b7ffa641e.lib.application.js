

var connect = require('connect')
, Router = require('./router')
, methods = require('methods')
, middleware = require('./middleware')
, debug = require('debug')('express:application')
, locals = require('./utils').locals
, View = require('./view')
, utils = connect.utils
, path = require('path')
, http = require('http')
, join = path.join;



var app = exports = module.exports = {};



app.init = function(){
this.cache = {};
