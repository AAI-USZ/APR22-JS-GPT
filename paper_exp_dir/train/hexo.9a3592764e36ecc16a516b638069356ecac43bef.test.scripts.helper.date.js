var moment = require('moment'),
should = require('chai').should();

describe('date', function(){
var date = require('../../../lib/plugins/helper/date');

var genTimeTag = function(date, format){
if (!(date instanceof Date)){
if (moment.isMoment(date)){
date = date.toDate();
} else {
date = new Date(date);
}
