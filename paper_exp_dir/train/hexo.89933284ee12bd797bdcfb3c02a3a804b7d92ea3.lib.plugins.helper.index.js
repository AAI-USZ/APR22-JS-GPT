'use strict';

module.exports = ctx => {
const { helper } = ctx.extend;

const date = require('./date');

helper.register('date', date.date);
helper.register('date_xml', date.date_xml);
helper.register('time', date.time);
helper.register('full_date', date.full_date);
helper.register('relative_date', date.relative_date);
helper.register('time_tag', date.time_tag);
helper.register('moment', date.moment);

helper.register('search_form', require('./search_form'));

const { strip_html, trim, titlecase, word_wrap, truncate, escape_html } = require('./format');

helper.register('strip_html', strip_html);
helper.register('trim', trim);
helper.register('titlecase', titlecase);
helper.register('word_wrap', word_wrap);
helper.register('truncate', truncate);
helper.register('escape_html', escape_html);

helper.register('fragment_cache', require('./fragment_cache')(ctx));

helper.register('gravatar', require('./gravatar'));

const is = require('./is');
helper.register('is_current', is.current);
helper.register('is_home', is.home);
