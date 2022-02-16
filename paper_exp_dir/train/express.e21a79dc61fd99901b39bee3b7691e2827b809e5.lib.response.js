




var fs = require('fs')
, http = require('http')
, path = require('path')
, connect = require('connect')
, utils = connect.utils
, statusCodes = http.STATUS_CODES
, send = connect.static.send
, mime = require('mime')
, basename = path.basename
, join = path.join;



var res = module.exports = {
__proto__: http.ServerResponse.prototype
};



res.status = function(code){
this.statusCode = code;
return this;
};



res.cache = function(type, options){
var val = type;
options = options || {};
if (options.maxAge) val += ', max-age=' + (options.maxAge / 1000);
if (options.maxStale) val += ', max-stale=' + (options.maxStale / 1000);
if (options.minFresh) val += ', min-fresh=' + (options.minFresh / 1000);
return this.set('Cache-Control', val);
};



res.send = function(body){
