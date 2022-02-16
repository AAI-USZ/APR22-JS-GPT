'use strict';

var moment = require('moment-timezone');
var isMoment = moment.isMoment;
var isDate = require('util').isDate;

function output(date, format, lang, timezone) {
if (date == null) date = moment();
if (!isMoment(date)) date = moment(isDate(date) ? date : new Date(date));

if (lang) date = date.locale(lang);
if (timezone) date = date.tz(timezone);

return date.format(format);
}

function toISOString(date) {
if (date == null) {
return new Date().toISOString();
}

if (date instanceof Date || isMoment(date)) {
return date.toISOString();
}

return new Date(date).toISOString();
}

function dateHelper(date, format) {
var config = this.config;
return output(date, format || config.date_format, getLanguage(this), config.timezone);
}

function timeHelper(date, format) {
