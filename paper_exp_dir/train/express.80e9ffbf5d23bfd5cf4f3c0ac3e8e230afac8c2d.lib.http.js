




var qs = require('qs')
, connect = require('connect')
, router = require('./router')
, Router = require('./router')
, view = require('./view')
, toArray = require('./utils').toArray
, methods = router.methods.concat('del', 'all')
, url = require('url')
, utils = connect.utils;



exports = module.exports = HTTPServer;



var app = HTTPServer.prototype;


