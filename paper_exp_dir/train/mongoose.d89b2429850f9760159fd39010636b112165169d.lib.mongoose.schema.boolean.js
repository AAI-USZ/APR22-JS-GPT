


var SchemaType = require('../schematype');



function SchemaBoolean (path, options) {
SchemaType.call(this, path, options);
};


SchemaBoolean.prototype.__proto__ = SchemaType.prototype;



SchemaBoolean.prototype.checkRequired = function (value) {
return value === true || value === false;
};



SchemaBoolean.prototype.cast = function (value) {
if (value === '0') return false;
return !!value;
};

SchemaBoolean.prototype.castForQuery = function ($conditional, val) {
if (arguments.length === 1) {
val = $conditional;
}
return this.cast(val);
};



module.exports = SchemaBoolean;
