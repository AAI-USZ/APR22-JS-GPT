'use strict';

var cheerio;

function tocHelper(str, options) {
options = options || {};

if (!cheerio) cheerio = require('cheerio');

var $ = cheerio.load(str);
var headingsMaxDepth = options.hasOwnProperty('max_depth') ? options.max_depth : 6;
var headingsSelector = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].slice(0, headingsMaxDepth).join(',');
var headings = $(headingsSelector);

if (!headings.length) return '';

var className = options.class || 'toc';
var listNumber = options.hasOwnProperty('list_number') ? options.list_number : true;
var result = '<ol class="' + className + '">';
var lastNumber = [0, 0, 0, 0, 0, 0];
var firstLevel = 0;
