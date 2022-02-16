var moment = require('moment');
var isMoment = moment.isMoment;

function output(date, format){
if (isMoment(date)){
return date.format(format);
} else {
return moment(date).format(format);
}
}

function toISOString(date){
if (date instanceof Date || isMoment(date)){
return date.toISOString();
} else {
return new Date(date).toISOString();
}
}

