var rTag = /<a(.+?)>(.+?)<\/a>/g,
rHref = /href="(.*?)"/,
rProtocol = /^https?:\/{2}/,
rTarget = /target="_blank"/;

module.exports = function(data, callback){
var config = hexo.config;

if (!config.external_link) return callback();

data.content = data.content.replace(rTag, function(match, attr, title){

if (rTarget.test(attr)) return match;

var href = attr.match(rHref);


if (!href) return match;

var url = href[1];


if (!rProtocol.test(url)) return match;


if (url.substring(0, config.url.length) === config.url) return match;

return '<a' + attr + ' target="_blank">' + title + '</a>';
});

callback(null, data);
};
