




var connect = require('connect')
, Router = require('./router')
, toArray = require('./utils').toArray
, methods = Router.methods.concat('del', 'all')
, request = require('./request')
, response = require('./response')
, View = require('./view')
, url = require('url')
, utils = connect.utils
, path = require('path')
, join = path.join
, fs = require('fs')
, qs = require('qs');



