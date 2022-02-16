


var mime = require('connect').mime
, deprecate = require('util').deprecate
, crc32 = require('buffer-crc32');



var toString = {}.toString;



exports.deprecate = function(fn, msg){
return 'test' !== process.env.NODE_ENV
? deprecate(fn, 'express: ' + msg)
: fn;
};
