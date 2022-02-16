


var driver = global.MONGOOSE_DRIVER_PATH || '../drivers/node-mongodb-native';



var EmbeddedDocument = require('./document');
var ObjectId = require('./objectid');
var Binary = require(driver + '/binary');



function MongooseBuffer (value, encode, offset) {
var length = arguments.length;
var val;

if (0 === length || null === arguments[0] || undefined === arguments[0]) {
val = 0;
} else {
val = value;
}

var encoding;
var path;
var doc;

if (Array.isArray(encode)) {

path = encode[0];
doc = encode[1];
} else {
encoding = encode;
}

var buf = new Buffer(val, encoding, offset);
buf.__proto__ = MongooseBuffer.prototype;


Object.defineProperties(buf, {
validators: { value: [] }
, _path: { value: path }
, _parent: { value: doc }
});

if (doc && "string" === typeof path) {
Object.defineProperty(buf, '_schema', {
value: doc.schema.path(path)
});
}

return buf;
};



MongooseBuffer.prototype = new Buffer(0);



MongooseBuffer.prototype._parent;




MongooseBuffer.prototype._markModified = function () {
var parent = this._parent;

if (parent) {
parent.markModified(this._path);
}
return this;
};



MongooseBuffer.prototype.write = function () {
var written = Buffer.prototype.write.apply(this, arguments);

if (written > 0) {
this._markModified();
}

return written;
};



MongooseBuffer.prototype.copy = function (target) {
var ret = Buffer.prototype.copy.apply(this, arguments);

if (target instanceof MongooseBuffer) {
target._markModified();
}

return ret;
};



'writeUInt8 writeUInt16 writeUInt32 writeInt8 writeInt16 writeInt32 ' +
'writeFloat writeDouble fill' +
'utf8Write binaryWrite asciiWrite set'.split(' ').forEach(function (method) {
if (!Buffer.prototype[method]) return;
MongooseBuffer.prototype[method] = new Function(
'var ret = Buffer.prototype.'+method+'.apply(this, arguments);' +
'this._markModified();' +
'return ret;'
)
});



MongooseBuffer.prototype.toObject = function () {
return new Binary(this, 0x00);
};



MongooseBuffer.Binary = Binary;

module.exports = MongooseBuffer;
