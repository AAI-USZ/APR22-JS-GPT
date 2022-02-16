


var mime = require('connect').mime
, crc = require('crc');



exports.etag = function(body){
return Buffer.isBuffer(body)
? crc.buffer.crc32(body)
: crc.crc32(body);
};



