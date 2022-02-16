'use strict';


class SchemaTypeMoment extends SchemaType {
constructor(name, options = {}) {
super(name, options);
}
}

function toMoment(value) {


if (moment.isMoment(value)) return moment(value._d);
return moment(value);
}

SchemaTypeMoment.prototype.cast = function(value, data) {
value = SchemaType.prototype.cast.call(this, value, data);
if (value == null) return value;

const { options } = this;
value = toMoment(value);

