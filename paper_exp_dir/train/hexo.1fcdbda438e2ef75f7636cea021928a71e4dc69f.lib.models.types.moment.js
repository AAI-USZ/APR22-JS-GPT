'use strict';

const { SchemaType } = require('warehouse');
const { moment, toMomentLocale } = require('../../plugins/helper/date');

class SchemaTypeMoment extends SchemaType {
constructor(name, options = {}) {
super(name, options);
}

cast(value, data) {
value = super.cast(value, data);
if (value == null) return value;

const { options } = this;
value = toMoment(value);

if (options.language) value = value.locale(toMomentLocale(options.language));
if (options.timezone) value = value.tz(options.timezone);

