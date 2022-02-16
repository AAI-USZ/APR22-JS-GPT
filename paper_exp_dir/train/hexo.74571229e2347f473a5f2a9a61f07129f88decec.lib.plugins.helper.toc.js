'use strict';

var cheerio;

function tocHelper(str, options){
options = options || {};

if (!cheerio) cheerio = require('cheerio');

var $ = cheerio.load(str);
var headings = $('h1, h2, h3, h4, h5, h6');
