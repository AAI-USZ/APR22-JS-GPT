'use strict';

module.exports = function(ctx){
var helper = ctx.extend.helper;

var date = require('./date');

helper.register('date', date.date);
helper.register('date_fromNow', date.date_fromNow);
helper.register('date_xml', date.date_xml);
helper.register('time', date.time);
helper.register('full_date', date.full_date);
helper.register('time_tag', date.time_tag);
helper.register('moment', date.moment);

helper.register('search_form', require('./search_form'));

var format = require('./format');
