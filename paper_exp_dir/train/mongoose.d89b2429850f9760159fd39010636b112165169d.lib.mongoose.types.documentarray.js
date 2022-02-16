


var MongooseArray = require('./array')
, driver = global.MONGOOSE_DRIVER_PATH || '../drivers/node-mongodb-native'
, ObjectId = require(driver + '/objectid')
, ObjectIdSchema = require('../schema/objectid');



function MongooseDocumentArray (values, path, doc) {
var arr = [];
arr.push.apply(arr, values);
arr.__proto__ = MongooseDocumentArray.prototype;

arr._atomics = [];
arr.validators = [];
arr._path = path;
arr._parent = doc;
if (doc)
arr._schema = doc.schema.path(path);

return arr;
};



MongooseDocumentArray.prototype.__proto__ = MongooseArray.prototype;



MongooseDocumentArray.prototype._cast = function (value) {
var doc = new this._schema.caster(value, this);
return doc;
};



MongooseDocumentArray.prototype.id = function (id) {
try {
var casted = ObjectId.toString(ObjectIdSchema.prototype.cast.call({}, id));
} catch (e) {
var casted = null;
}

for (var i = 0, l = this.length; i < l; i++) {
if (!(this[i].get('_id') instanceof ObjectId)) {
if (String(id) == this[i].get('_id').toString())
return this[i];
} else {
if (casted == this[i].get('_id').toString())
return this[i];
}
}

return null;
};



MongooseDocumentArray.prototype.toObject = function () {
return this.map(function (doc) {
return doc.toObject();
});
};



MongooseDocumentArray.prototype.inspect = function () {
return '[' + this.map(function (doc) {
return doc.inspect();
}).join('\n') + ']';
};



module.exports = MongooseDocumentArray;
