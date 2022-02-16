

'use strict';



var Buffer = require('safe-buffer').Buffer
var contentDisposition = require('content-disposition');
var deprecate = require('depd')('express');
var encodeUrl = require('encodeurl');
var escapeHtml = require('escape-html');
var http = require('http');
var isAbsolute = require('./utils').isAbsolute;
var onFinished = require('on-finished');
var path = require('path');
var statuses = require('statuses')
var merge = require('utils-merge');
var sign = require('cookie-signature').sign;
var normalizeType = require('./utils').normalizeType;
var normalizeTypes = require('./utils').normalizeTypes;
var setCharset = require('./utils').setCharset;
var cookie = require('cookie');
var send = require('send');
var extname = path.extname;
var mime = send.mime;
var resolve = path.resolve;
var vary = require('vary');



var res = Object.create(http.ServerResponse.prototype)



module.exports = res



var charsetRegExp = /;\s*charset\s*=/;



res.status = function status(code) {
if (code === undefined || code === null) {
throw new TypeError('code argument is required to res.status')
}

this.statusCode = code;
return this;
};



res.links = function(links){
