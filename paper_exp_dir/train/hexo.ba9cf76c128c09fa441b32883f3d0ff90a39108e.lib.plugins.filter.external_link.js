var url = require('url'),
cheerio = require('cheerio'),
domSerializer = require('dom-serializer');

module.exports = function(data, callback){
var config = hexo.config;

if (!config.external_link) return callback();

var $ = cheerio.load(data.content, {decodeEntities: false});

$('a').each(function(){

if ($(this).attr('target')) return;


var href = $(this).attr('href');
if (!href) return;

var data = url.parse(href);


if (!data.protocol) return;


if (data.hostname === config.url) return match;

$(this)
.attr('target', '_blank')
.attr('rel', 'external');
});



data.content = domSerializer($._root.children);

callback(null, data);
};
