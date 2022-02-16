'use strict';

const moment = require('moment-timezone');
const isMoment = moment.isMoment;
const isDate = require('lodash').isDate;

function getMoment(date, lang, timezone) {
if (date == null) date = moment();
if (!isMoment(date)) date = moment(isDate(date) ? date : new Date(date));

if (lang) date = date.locale(lang);
if (timezone) date = date.tz(timezone);

return date;
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
const config = this.config;
const moment = getMoment(date, getLanguage(this), config.timezone);
return moment.format(format || config.date_format);
}

function timeHelper(date, format) {
const config = this.config;
const moment = getMoment(date, getLanguage(this), config.timezone);
return moment.format(format || config.time_format);
}

function fullDateHelper(date, format) {
if (format) {
const moment = getMoment(date, getLanguage(this), this.config.timezone);
return moment.format(format);
}

return `${this.date(date)} ${this.time(date)}`;
}

function relativeDateHelper(date) {
const config = this.config;
