

var mime = require('send').mime;
var crc32 = require('buffer-crc32');
var crypto = require('crypto');
var basename = require('path').basename;
var proxyaddr = require('proxy-addr');
var qs = require('qs');
var querystring = require('querystring');
var typer = require('media-typer');



exports.etag = function etag(body, encoding){
if (body.length === 0) {

return '"1B2M2Y8AsgTpgAmY7PhCfg=="'
}
