var moment = require('moment');
var isMoment = moment.isMoment;

function output(date, format, lang){
if (!isMoment(date)) date = moment(date);
if (lang) date = date.locale(lang);

return date.format(format);
}

function toISOString(date){
if (date instanceof Date || isMoment(date)){
return date.toISOString();
} else {
