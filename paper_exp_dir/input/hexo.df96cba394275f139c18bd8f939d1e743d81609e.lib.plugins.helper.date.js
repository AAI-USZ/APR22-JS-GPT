var moment = require('moment'),
isMoment = moment.isMoment;

var result = function(date, format){
if (isMoment(date)){
return date.format(format);
} else {
return moment(date).format(format);
}
};

var toISOString = function(date){
if (!date) date = new Date();

if (date instanceof Date){
return date.toISOString();
} else if (isMoment(date)){
return date.toDate().toISOString();
} else {
return new Date(date).toISOString();
}
};

exports.date = function(date, format){
};

exports.date_xml = toISOString;

exports.time = function(date, format){
};

exports.full_date = function(date, format){
