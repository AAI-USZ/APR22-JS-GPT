




var connect = require('connect')
, Router = require('./router')
, view = require('./view')
, toArray = require('./utils').toArray
, methods = Router.methods.concat('del', 'all')
, res = require('./response')
, union = require('./utils').union
, url = require('url')
, utils = connect.utils
, path = require('path')
, extname = path.extname
