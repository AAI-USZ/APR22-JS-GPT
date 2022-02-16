

var SchemaType = require('../schematype')
, CastError = SchemaType.CastError
, ArrayNumberSchema = function () {}
, Types = {
Boolean: require('./boolean')
, Date: require('./date')
, Number: ArrayNumberSchema
, String: require('./string')
, ObjectId: require('./objectid')
, Buffer: require('./buffer')
}
, MongooseArray = require('../types').Array
, Query = require('../query');



function SchemaArray (key, cast, options) {
SchemaType.call(this, key, options);

if (cast) {
var castOptions = {};

if (Object == cast.constructor) {

castOptions = cast;
cast = cast.type;
delete castOptions.type;
}

var caster = cast.name in Types ? Types[cast.name] : cast;
this.casterConstructor = caster;
this.caster = new caster(null, castOptions);
}

var self = this
, defaultArr
, fn;

if (this.defaultValue) {
defaultArr = this.defaultValue;
fn = 'function' == typeof defaultArr;
}

this.default(function(){
var arr = fn ? defaultArr() : defaultArr || [];
return new MongooseArray(arr, self.path, this);
});
};



SchemaArray.prototype.__proto__ = SchemaType.prototype;



SchemaArray.prototype.checkRequired = function (value) {
return !!(value && value.length);
};



SchemaArray.prototype.applyGetters = function (value, scope) {
if (this.caster.options && this.caster.options.ref) {

return value;
}

return SchemaType.prototype.applyGetters.call(this, value, scope);
};



SchemaArray.prototype.cast = function (value, doc, init) {
if (Array.isArray(value)) {
if (!(value instanceof MongooseArray)) {
value = new MongooseArray(value, this.path, doc);
}

if (this.caster) {
for (var i = 0, l = value.length; i < l; i++) {
try {
value[i] = this.caster.cast(value[i], doc, init);
} catch (e) {

throw new CastError(e.type, value);
}
}
}

return value;
} else {
return this.cast([value], doc);
}
};

SchemaArray.prototype.castForQuery = function ($conditional, val) {
var handler;
if (arguments.length === 2) {
handler = this.$conditionalHandlers[$conditional];
if (!handler)
throw new Error("Can't use " + $conditional + " with Array.");
val = handler.call(this, val);
} else {
val = $conditional;
var proto = this.casterConstructor.prototype;
var method = proto.castForQuery || proto.cast;
if (Array.isArray(val)) {
val = val.map(function (v) {
if (method) v = method.call(proto, v);
return v.toObject ? v.toObject() : v;
});
} else if (method) {
val = method.call(proto, val);
}
}
return val && val.toObject ? val.toObject() : val;
};

SchemaArray.prototype.$conditionalHandlers = {
'$all': function handle$all (val) {
if (!Array.isArray(val)) {
val = [val];
}
return this.castForQuery(val);
}

, '$elemMatch': function (val) {
var query = new Query(val);
query.cast(this.casterConstructor)
return query._conditions;
}
, '$size': function (val) {
return ArrayNumberSchema.prototype.cast.call(this, val);
}
, '$ne': SchemaArray.prototype.castForQuery
, '$in': SchemaArray.prototype.castForQuery
, '$nin': SchemaArray.prototype.castForQuery
, '$near': SchemaArray.prototype.castForQuery
, '$maxDistance': function (val) {
return ArrayNumberSchema.prototype.cast.call(this, val);
}
};



ArrayNumberSchema.prototype.cast = function (value) {
if (!isNaN(value)) {
if (value instanceof Number || typeof value == 'number' ||
(value.toString && value.toString() == Number(value)))
return Number(value);
}

throw new CastError('number', value);
};



module.exports = SchemaArray;
