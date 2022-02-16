'use strict';

const { parse, resolve } = require('url');
const { isMoment, isDate } = require('moment');
const { prettyUrls, htmlTag, stripHTML, escapeHTML } = require('hexo-util');

const localeMap = {
'en': 'en_US',
'de': 'de_DE',
'es': 'es_ES',
'fr': 'fr_FR',
'hu': 'hu_HU',
