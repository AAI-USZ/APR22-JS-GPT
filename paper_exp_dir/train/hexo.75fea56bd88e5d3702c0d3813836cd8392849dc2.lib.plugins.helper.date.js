'use strict';

const moment = require('moment-timezone');
const { isMoment } = moment;

const isDate = value =>
typeof value === 'object' && value instanceof Date && !isNaN(value.getTime());

function getMoment(date, lang, timezone) {
if (date == null) date = moment();
if (!isMoment(date)) date = moment(isDate(date) ? date : new Date(date));
lang = toMomentLocale(lang);

if (lang) date = date.locale(lang);
if (timezone) date = date.tz(timezone);
