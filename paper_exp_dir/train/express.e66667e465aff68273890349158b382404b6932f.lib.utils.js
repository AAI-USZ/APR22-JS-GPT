


var mime = require('connect').mime
, proxyaddr = require('proxy-addr')
, crc32 = require('buffer-crc32')
, crypto = require('crypto');
var typer = require('media-typer');



var toString = {}.toString;



exports.etag = function etag(body, encoding){
if (body.length === 0) {

return '"1B2M2Y8AsgTpgAmY7PhCfg=="'
}

