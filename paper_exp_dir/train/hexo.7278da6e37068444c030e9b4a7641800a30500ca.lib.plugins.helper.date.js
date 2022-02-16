'use strict';

var moment = require('moment-timezone');
var isMoment = moment.isMoment;
var isDate = require('util').isDate;

function getMoment(date, lang, timezone){
if (date == null) date = moment();
if (!isMoment(date)) date = moment(isDate(date) ? date : new Date(date));

if (lang) date = date.locale(lang);
if (timezone) date = date.tz(timezone);

return date;
}

function toISOString(date){
if (date == null){
return new Date().toISOString();
}

if (date instanceof Date || isMoment(date)){
