'use strict';

var cheerio;
const _ = require('lodash');

function tocHelper(str, options) {
options = options || {};

if (!cheerio) cheerio = require('cheerio');

var $ = cheerio.load(str);
var headingsMaxDepth = options.hasOwnProperty('max_depth') ? options.max_depth : 6;
var headingsSelector = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].slice(0, headingsMaxDepth).join(',');
