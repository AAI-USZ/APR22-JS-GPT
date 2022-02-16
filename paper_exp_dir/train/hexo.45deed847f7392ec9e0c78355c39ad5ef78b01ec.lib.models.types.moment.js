var moment = require('moment');
var SchemaType = require('warehouse').SchemaType;
var util = require('../../util');

function SchemaTypeMoment(name, options){
SchemaType.call(this, name, options);
}

util.inherits(SchemaTypeMoment, SchemaType);

SchemaTypeMoment.prototype.cast = function(value, data){
value = SchemaType.prototype.cast.call(this, value, data);

if (value == null) return value;

return moment(value);
};

SchemaTypeMoment.prototype.validate = function(value, data){
value = SchemaType.prototype.validate.call(this, value, data);
if (value instanceof Error) return value;

value = moment(value);

if (value != null && (!moment.isMoment(value) || !value.isValid())){
return new Error('`' + value + '` is not a valid date!');
}



