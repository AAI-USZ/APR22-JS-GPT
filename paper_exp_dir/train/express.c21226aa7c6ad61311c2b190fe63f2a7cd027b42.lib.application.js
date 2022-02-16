

var connect = require('connect')
, Router = require('./router')
, methods = require('methods')
, middleware = require('./middleware')
, debug = require('debug')('express:application')
, locals = require('./utils').locals
, compileETag = require('./utils').compileETag
, compileTrust = require('./utils').compileTrust
, View = require('./view')
, utils = connect.utils
, deprecate = require('./utils').deprecate
, http = require('http');



var app = exports = module.exports = {};



app.init = function(){
