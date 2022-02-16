

var mime = require('send').mime;
var crc32 = require('buffer-crc32');
var crypto = require('crypto');
var basename = require('path').basename;
var deprecate = require('util').deprecate;
var proxyaddr = require('proxy-addr');


var charsetRegExp = /;\s*charset\s*=/;



exports.deprecate = function(fn, msg){
if (process.env.NODE_ENV === 'test') return fn;


msg = 'express: ' + msg;

if (process.stderr.isTTY) {

msg = '\x1b[31;1m' + msg + '\x1b[0m';
}

return deprecate(fn, msg);
};



exports.etag = function etag(body, encoding){
if (body.length === 0) {

return '"1B2M2Y8AsgTpgAmY7PhCfg=="'
}

var hash = crypto
.createHash('md5')
.update(body, encoding)
.digest('base64')
return '"' + hash + '"'
};



exports.wetag = function wetag(body, encoding){
if (body.length === 0) {

return 'W/"0-0"'
}

var buf = Buffer.isBuffer(body)
? body
: new Buffer(body, encoding)
var len = buf.length
return 'W/"' + len.toString(16) + '-' + crc32.unsigned(buf) + '"'
};



exports.isAbsolute = function(path){
if ('/' == path[0]) return true;
if (':' == path[1] && '\\' == path[2]) return true;
if ('\\\\' == path.substring(0, 2)) return true;
};



exports.flatten = function(arr, ret){
ret = ret || [];
var len = arr.length;
for (var i = 0; i < len; ++i) {
if (Array.isArray(arr[i])) {
exports.flatten(arr[i], ret);
} else {
ret.push(arr[i]);
}
}
return ret;
};



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



exports.contentDisposition = function(filename){
var ret = 'attachment';
if (filename) {
filename = basename(filename);

ret = /[^\040-\176]/.test(filename)
? 'attachment; filename="' + encodeURI(filename) + '"; filename*=UTF-8\'\'' + encodeURI(filename)
: 'attachment; filename="' + filename + '"';
}

return ret;
};



function acceptParams(str, index) {
var parts = str.split(/ *; */);
var ret = { value: parts[0], quality: 1, params: {}, originalIndex: index };

for (var i = 1; i < parts.length; ++i) {
var pms = parts[i].split(/ *= */);
if ('q' == pms[0]) {
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



exports.setCharset = function(type, charset){
if (!type || !charset) return type;

var exists = charsetRegExp.test(type);


if (exists) {
var parts = type.split(';');

for (var i = 1; i < parts.length; i++) {
if (charsetRegExp.test(';' + parts[i])) {
parts.splice(i, 1);
break;
}
}

type = parts.join(';');
}

return type + '; charset=' + charset;
};
