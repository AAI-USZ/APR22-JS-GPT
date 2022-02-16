

var connect = require('connect')
, Router = require('./router')
, methods = Router.methods
, middleware = require('./middleware')
, debug = require('debug')('express:application')
, locals = require('./utils').locals
, View = require('./view')
, url = require('url')
, utils = connect.utils
, path = require('path')
