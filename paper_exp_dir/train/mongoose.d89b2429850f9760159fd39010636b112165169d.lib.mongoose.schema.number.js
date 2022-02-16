


var SchemaType = require('../schematype')
, CastError = SchemaType.CastError
, MongooseNumber = require('../types/number');



function SchemaNumber (key, options) {
SchemaType.call(this, key, options);
};



SchemaNumber.prototype.__proto__ = SchemaType.prototype;



SchemaNumber.prototype.checkRequired = function (value) {
return typeof value == 'number' || value instanceof Number;
};



SchemaNumber.prototype.min = function (value, message) {
if (this.minValidator)
this.validators = this.validators.filter(function(v){
return v[1] != 'min';
});
if (value != null)
this.validators.push([function(v){
return v >= value;
}, 'min']);
return this;
};



SchemaNumber.prototype.max = function (value, message) {
if (this.maxValidator)
this.validators = this.validators.filter(function(v){
return v[1] != 'max';
});
if (value != null)
this.validators.push([this.maxValidator = function(v){
return v <= value;
}, 'max']);
return this;
};



SchemaNumber.prototype.cast = function (value, doc) {
if (!isNaN(value)){
if (null === value) return value;
if ('' === value) return null;
if ('string' === typeof value) value = Number(value);
if (value instanceof Number || typeof value == 'number' ||
(value.toString && value.toString() == Number(value)))
return new MongooseNumber(value, this.path, doc);
}
throw new CastError('number', value);
};

function handleSingle (val) {
return this.cast(val).valueOf();
}

function handleArray (val) {
var self = this;
return val.map( function (m) {
return self.cast(m).valueOf();
});
}

SchemaNumber.prototype.$conditionalHandlers = {
'$lt' : handleSingle
, '$lte': handleSingle
, '$gt' : handleSingle
, '$gte': handleSingle
, '$ne' : handleSingle
, '$in' : handleArray
, '$nin': handleArray
, '$mod': handleArray
, '$all': handleArray
};

SchemaNumber.prototype.castForQuery = function ($conditional, val) {
var handler;
if (arguments.length === 2) {
handler = this.$conditionalHandlers[$conditional];
if (!handler)
throw new Error("Can't use " + $conditional + " with Number.");
return handler.call(this, val);
} else {
val = $conditional;
return this.cast(val);
}
};



module.exports = SchemaNumber;
