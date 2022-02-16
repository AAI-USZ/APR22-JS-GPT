var cheerio = require('cheerio');
var url = require('url');

function externalLinkFilter(data){
var config = this.config;
if (!config.external_link) return;

var $ = cheerio.load(data.content, {decodeEntities: false});

$('a').each(function(){

if ($(this).attr('target')) return;


var href = $(this).attr('href');
if (!href) return;

var data = url.parse(href);


if (!data.protocol) return;


if (data.hostname === config.url) return;

$(this)
.attr('target', '_blank')
.attr('rel', 'external');
});

data.content = $.html();
}
