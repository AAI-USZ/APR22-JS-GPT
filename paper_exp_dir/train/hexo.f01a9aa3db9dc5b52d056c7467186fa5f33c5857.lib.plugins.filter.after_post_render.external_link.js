'use strict';

var url = require('url');
var cheerio;

function externalLinkFilter(data) {
var config = this.config;
if (!config.external_link) return;

if (!cheerio) cheerio = require('cheerio');

var $ = cheerio.load(data.content, {decodeEntities: false});
var siteHost = url.parse(config.url).hostname || config.url;

$('a').each(function() {
