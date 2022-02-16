




var connect = require('connect')
, router = require('./router')
, Router = require('./router')
, view = require('./view')
, toArray = require('./utils').toArray
, methods = router.methods.concat('del', 'all')
, res = require('./response')
, url = require('url')
, utils = connect.utils
, qs = require('qs');
