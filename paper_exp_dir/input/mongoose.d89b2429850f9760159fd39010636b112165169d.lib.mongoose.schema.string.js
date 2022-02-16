


var SchemaType = require('../schematype')
, CastError = SchemaType.CastError;



function SchemaString (key, options) {
this.enumValues = [];
this.regExp = null;
SchemaType.call(this, key, options);
};



SchemaString.prototype.__proto__ = SchemaType.prototype;



SchemaString.prototype.enum = function () {
var len = arguments.length;
if (!len || undefined === arguments[0] || false === arguments[0]) {
if (this.enumValidator){
this.enumValidator = false;
this.validators = this.validators.filter(function(v){
return v[1] != 'enum';
});
}
return;
}

for (var i = 0; i < len; i++) {
if (undefined !== arguments[i]) {
this.enumValues.push(this.cast(arguments[i]));
}
}

if (!this.enumValidator) {
var values = this.enumValues;
this.enumValidator = function(v){
return ~values.indexOf(v);
};
this.validators.push([this.enumValidator, 'enum']);
}
};



SchemaString.prototype.lowercase = function () {
return this.set(function (v) {
return v.toLowerCase();
});
};



SchemaString.prototype.uppercase = function () {
return this.set(function (v) {
return v.toUpperCase();
});
};



SchemaString.prototype.trim = function () {
return this.set(function (v) {
return v.trim();
});
};



SchemaString.prototype.match = function(regExp){
this.validators.push([function(v){
return regExp.test(v);
}, 'regexp']);
};



SchemaString.prototype.checkRequired = function (v) {
return (v instanceof String || typeof v == 'string') && v.length;
};



SchemaString.prototype.cast = function (value) {
if (value === null) return value;
if (value.toString) return value.toString();
throw new CastError('string', value);
};

function handleSingle (val) {
return this.castForQuery(val);
}

function handleArray (val) {
var self = this;
return val.map(function (m) {
return self.castForQuery(m);
});
}

SchemaString.prototype.$conditionalHandlers = {
'$ne' : handleSingle
, '$in' : handleArray
, '$nin': handleArray
, '$gt' : handleSingle
, '$lt' : handleSingle
, '$gte': handleSingle
, '$lte': handleSingle
, '$all': handleArray
};

SchemaString.prototype.castForQuery = function ($conditional, val) {
var handler;
if (arguments.length === 2) {
handler = this.$conditionalHandlers[$conditional];
if (!handler)
throw new Error("Can't use " + $conditional + " with String.");
return handler.call(this, val);
} else {
val = $conditional;
if (val instanceof RegExp) return val;
return this.cast(val);
}
};



module.exports = SchemaString;
