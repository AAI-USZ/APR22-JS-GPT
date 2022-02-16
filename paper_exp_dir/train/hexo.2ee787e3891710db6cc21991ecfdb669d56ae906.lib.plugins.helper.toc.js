'use strict';

let cheerio;
const _ = require('lodash');

function tocHelper(str, options = {}) {
if (!cheerio) cheerio = require('cheerio');

const $ = cheerio.load(str);
const headingsMaxDepth = options.hasOwnProperty('max_depth') ? options.max_depth : 6;
const headingsSelector = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].slice(0, headingsMaxDepth).join(',');
const headings = $(headingsSelector);

if (!headings.length) return '';

const className = options.class || 'toc';
