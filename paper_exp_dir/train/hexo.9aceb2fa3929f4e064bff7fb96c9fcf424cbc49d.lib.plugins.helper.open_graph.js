'use strict';

const urlFn = require('url');
const moment = require('moment');
const { encodeURL, htmlTag, stripHTML, escapeHTML } = require('hexo-util');
const localeMap = {
'en': 'en_US',
'de': 'de_DE',
'es': 'es_ES',
'fr': 'fr_FR',
'hu': 'hu_HU',
'id': 'id_ID',
'it': 'it_IT',
'ja': 'ja_JP',
'ko': 'ko_KR',
