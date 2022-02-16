'use strict';

const url = require('url');
let cheerio;

function externalLinkFilter(data) {
const { config } = this;
if (!config.external_link) return;

if (!cheerio) cheerio = require('cheerio');

const $ = cheerio.load(data.content, {decodeEntities: false});
const siteHost = url.parse(config.url).hostname || config.url;

$('a').each(function() {

if ($(this).attr('target')) return;


const href = $(this).attr('href');
if (!href) return;

const data = url.parse(href);


if (!data.protocol) return;


if (data.hostname === siteHost) return;

$(this)
.attr('target', '_blank')
.attr('rel', 'noopener');
});

data.content = $.html();
}

module.exports = externalLinkFilter;
