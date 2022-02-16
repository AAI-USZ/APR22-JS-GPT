




var connect = require('connect')
, Router = require('./router')
, methods = Router.methods.concat('del', 'all')
, View = require('./view')
, url = require('url')
, utils = connect.utils
, path = require('path')
, join = path.join
, fs = require('fs')
, qs = require('qs');



var app = exports = module.exports = {};
