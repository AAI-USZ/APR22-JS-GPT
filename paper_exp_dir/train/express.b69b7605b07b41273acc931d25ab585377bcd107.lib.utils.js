

'use strict';



var contentDisposition = require('content-disposition');
var contentType = require('content-type');
var deprecate = require('depd')('express');
var flatten = require('array-flatten');
var mime = require('send').mime;
var basename = require('path').basename;
var etag = require('etag');
var proxyaddr = require('proxy-addr');
var qs = require('qs');
var querystring = require('querystring');



exports.etag = function (body, encoding) {
var buf = !Buffer.isBuffer(body)
? new Buffer(body, encoding)
: body;

return etag(buf, {weak: false});
};



exports.wetag = function wetag(body, encoding){
var buf = !Buffer.isBuffer(body)
? new Buffer(body, encoding)
: body;

return etag(buf, {weak: true});
};



exports.isAbsolute = function(path){
if ('/' === path[0]) return true;
if (':' === path[1] && '\\' === path[2]) return true;
if ('\\\\' === path.substring(0, 2)) return true;
};



exports.flatten = deprecate.function(flatten,
'utils.flatten: use array-flatten npm module instead');



exports.normalizeType = function(type){
return ~type.indexOf('/')
? acceptParams(type)
: { value: mime.lookup(type), params: {} };
};



exports.normalizeTypes = function(types){
var ret = [];

for (var i = 0; i < types.length; ++i) {
ret.push(exports.normalizeType(types[i]));
}

return ret;
};



exports.contentDisposition = deprecate.function(contentDisposition,
'utils.contentDisposition: use content-disposition npm module instead');



function acceptParams(str, index) {
var parts = str.split(/ *; */);
var ret = { value: parts[0], quality: 1, params: {}, originalIndex: index };

for (var i = 1; i < parts.length; ++i) {
var pms = parts[i].split(/ *= */);
if ('q' === pms[0]) {
ret.quality = parseFloat(pms[1]);
} else {
ret.params[pms[0]] = pms[1];
}
}

return ret;
}



exports.compileETag = function(val) {
var fn;

if (typeof val === 'function') {
return val;
}

switch (val) {
case true:
fn = exports.wetag;
break;
case false:
break;
case 'strong':
fn = exports.etag;
break;
case 'weak':
fn = exports.wetag;
break;
default:
throw new TypeError('unknown value for etag function: ' + val);
}

return fn;
}



exports.compileQueryParser = function compileQueryParser(val) {
var fn;

if (typeof val === 'function') {
return val;
}

switch (val) {
case true:
fn = querystring.parse;
break;
case false:
fn = newObject;
break;
case 'extended':
fn = parseExtendedQueryString;
break;
case 'simple':
fn = querystring.parse;
break;
default:
throw new TypeError('unknown value for query parser function: ' + val);
}

return fn;
}



exports.compileTrust = function(val) {
if (typeof val === 'function') return val;

if (val === true) {

return function(){ return true };
}

if (typeof val === 'number') {

return function(a, i){ return i < val };
}

if (typeof val === 'string') {

val = val.split(/ *, */);
}

return proxyaddr.compile(val || []);
}



exports.setCharset = function setCharset(type, charset) {
if (!type || !charset) {
return type;
}


var parsed = contentType.parse(type);


parsed.parameters.charset = charset;


return contentType.format(parsed);
};



function parseExtendedQueryString(str) {
return qs.parse(str, {
allowDots: false,
allowPrototypes: true
});
}



function newObject() {
return {};
}
