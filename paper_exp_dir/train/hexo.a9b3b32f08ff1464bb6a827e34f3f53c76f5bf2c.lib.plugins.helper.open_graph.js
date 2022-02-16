'use strict';

<<<<<<< HEAD
const { parse, resolve } = require('url');
const { isMoment, isDate } = require('moment');
const { encodeURL, htmlTag, stripHTML, escapeHTML } = require('hexo-util');
=======
const urlFn = require('url');
const moment = require('moment');
const { htmlTag, prettyUrls, stripHTML, escapeHTML } = require('hexo-util');
>>>>>>> fix(open_graph-helper): pass all pretty_urls options
const localeMap = {
