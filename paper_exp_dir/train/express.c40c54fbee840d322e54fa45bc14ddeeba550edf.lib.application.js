




var connect = require('connect')
, Router = require('./router')
, toArray = require('./utils').toArray
, methods = Router.methods.concat('del', 'all')
, res = require('./response')
, union = require('./utils').union
, url = require('url')
, utils = connect.utils
, path = require('path')
, extname = path.extname
, join = path.join
, fs = require('fs')
