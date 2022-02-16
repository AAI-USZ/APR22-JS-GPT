var moment = require('moment-timezone');
var SchemaType = require('warehouse').SchemaType;
var util = require('util');

function SchemaTypeMoment(name, options){
SchemaType.call(this, name, options);
}

util.inherits(SchemaTypeMoment, SchemaType);

function toMoment(value){


if (moment.isMoment(value)) return moment(value._d);
return moment(value);
}

SchemaTypeMoment.prototype.cast = function(value, data){
value = SchemaType.prototype.cast.call(this, value, data);
if (value == null) return value;

var options = this.options;
value = toMoment(value);

if (options.language) value = value.locale(options.language);
if (options.timezone) value = value.tz(options.timezone);

return value;
};

SchemaTypeMoment.prototype.validate = function(value, data){
