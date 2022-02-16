


var http = require('http')
, utils = require('./utils')
, connect = require('connect')
, parse = connect.utils.parseUrl
, mime = require('mime');



var req = exports = module.exports = {
__proto__: http.IncomingMessage.prototype
};
