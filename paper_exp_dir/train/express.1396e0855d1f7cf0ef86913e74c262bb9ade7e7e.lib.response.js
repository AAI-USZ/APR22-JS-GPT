

var http = require('http')
, path = require('path')
, mixin = require('utils-merge')
, escapeHtml = require('escape-html')
, sign = require('cookie-signature').sign
, normalizeType = require('./utils').normalizeType
, normalizeTypes = require('./utils').normalizeTypes
, etag = require('./utils').etag
, statusCodes = http.STATUS_CODES
, cookie = require('cookie')
, send = require('send')
, resolve = require('url').resolve
