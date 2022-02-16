




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



res.send = function(body){
