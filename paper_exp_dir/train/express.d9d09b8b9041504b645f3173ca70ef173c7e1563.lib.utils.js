

'use strict';



var contentDisposition = require('content-disposition');
var contentType = require('content-type');
var deprecate = require('depd')('express');
var flatten = require('array-flatten');
var mime = require('send').mime;
var etag = require('etag');
var proxyaddr = require('proxy-addr');
var qs = require('qs');
var querystring = require('querystring');



exports.etag = createETagGenerator({ weak: false })



exports.wetag = createETagGenerator({ weak: true })



exports.isAbsolute = function(path){
if ('/' === path[0]) return true;
if (':' === path[1] && ('\\' === path[2] || '/' === path[2])) return true;
