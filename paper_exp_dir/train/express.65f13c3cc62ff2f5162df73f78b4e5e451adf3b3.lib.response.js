

var http = require('http')
, path = require('path')
, connect = require('connect')
, utils = connect.utils
, sign = require('cookie-signature').sign
, normalizeType = require('./utils').normalizeType
, normalizeTypes = require('./utils').normalizeTypes
, deprecate = require('./utils').deprecate
, etag = require('./utils').etag
, statusCodes = http.STATUS_CODES
