


var SchemaType = require('../schematype')
, CastError = SchemaType.CastError;



function SchemaDate (key, options) {
SchemaType.call(this, key, options);
};



SchemaDate.prototype.__proto__ = SchemaType.prototype;



SchemaDate.prototype.checkRequired = function (value) {
return value instanceof Date;
};



SchemaDate.prototype.cast = function (value) {
if (value === null || value === '')
return null;

if (value instanceof Date)
return value;

var date;


if (value instanceof Number || 'number' == typeof value
|| String(value) == Number(value))
date = new Date(Number(value));


else if (value.toString)
date = new Date(value.toString());

if (date.toString() != 'Invalid Date')
return date;

throw new CastError('date', value);
};



function handleSingle (val) {
return this.cast(val);
}

function handleArray (val) {
var self = this;
return val.map( function (m) {
return self.cast(m);
});
}

SchemaDate.prototype.$conditionalHandlers = {
'$lt': handleSingle
, '$lte': handleSingle
, '$gt': handleSingle
, '$gte': handleSingle
, '$ne': handleSingle
, '$in': handleArray
, '$nin': handleArray
};

SchemaDate.prototype.castForQuery = function ($conditional, val) {
var handler;

if (2 !== arguments.length) {
return this.cast($conditional);
}

handler = this.$conditionalHandlers[$conditional];

if (!handler) {
throw new Error("Can't use " + $conditional + " with Date.");
}

return handler.call(this, val);
};



module.exports = SchemaDate;
