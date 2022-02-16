'use strict';

module.exports = function(ctx){
var helper = ctx.extend.helper;

var date = require('./date');

helper.register('date', date.date);
helper.register('date_xml', date.date_xml);
helper.register('time', date.time);
helper.register('full_date', date.full_date);
helper.register('time_tag', date.time_tag);
helper.register('moment', date.moment);

helper.register('search_form', require('./search_form'));

var format = require('./format');

helper.register('strip_html', format.strip_html);
helper.register('trim', format.trim);
helper.register('titlecase', format.titlecase);
helper.register('word_wrap', format.word_wrap);
helper.register('truncate', format.truncate);

helper.register('fragment_cache', require('./fragment_cache')(ctx));

helper.register('gravatar', require('./gravatar'));

var is = require('./is');
helper.register('is_current', is.current);
helper.register('is_home', is.home);
helper.register('is_post', is.post);
helper.register('is_archive', is.archive);
helper.register('is_year', is.year);
helper.register('is_month', is.month);
helper.register('is_category', is.category);
helper.register('is_tag', is.tag);

helper.register('list_archives', require('./list_archives'));
