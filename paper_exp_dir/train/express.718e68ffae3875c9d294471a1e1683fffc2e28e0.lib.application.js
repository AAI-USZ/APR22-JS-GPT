

var connect = require('connect')
, mixin = require('utils-merge')
, Router = require('./router')
, methods = require('methods')
, middleware = require('./middleware')
, debug = require('debug')('express:application')
, locals = require('./utils').locals
, View = require('./view')
, utils = connect.utils
, http = require('http');



