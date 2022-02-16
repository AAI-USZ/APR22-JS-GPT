'use strict';

const moment = require('moment-timezone');
const { isMoment } = moment;

const isDate = (value) => {
if (typeof value === 'object') {
if (value instanceof Date) return !isNaN(value.getTime());
}
return false;
};

function getMoment(date, lang, timezone) {
if (date == null) date = moment();
