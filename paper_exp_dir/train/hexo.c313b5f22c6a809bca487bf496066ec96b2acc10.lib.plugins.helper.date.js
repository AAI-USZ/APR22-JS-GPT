'use strict';

var moment = require('moment-timezone');
var isMoment = moment.isMoment;
var isDate = require('util').isDate;

function output(date, format, lang, timezone){
if (date == null) date = moment();
if (!isMoment(date)) date = moment(isDate(date) ? date : new Date(date));

if (lang) date = date.locale(lang);
if (timezone) date = date.tz(timezone);

