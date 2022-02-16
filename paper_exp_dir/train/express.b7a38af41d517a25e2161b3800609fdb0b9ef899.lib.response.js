

var http = require('http')
, path = require('path')
, connect = require('connect')
, utils = connect.utils
, sign = require('cookie-signature').sign
, normalizeType = require('./utils').normalizeType
, normalizeTypes = require('./utils').normalizeTypes
, etag = require('./utils').etag
, statusCodes = http.STATUS_CODES
, cookie = require('cookie')
, send = require('send')
, mime = connect.mime
, resolve = require('url').resolve
, basename = path.basename
, extname = path.extname;



var res = module.exports = {
__proto__: http.ServerResponse.prototype
};



res.status = function(code){
this.statusCode = code;
