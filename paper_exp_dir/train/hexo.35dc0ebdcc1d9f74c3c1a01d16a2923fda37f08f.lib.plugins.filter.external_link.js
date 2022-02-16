var config = hexo.config;

var rTag = /<a(.+?)>(.+?)<\/a>/g,
rHref = /href="(.*?)"/,
rProtocol = /^https?\/{2}/,
rTarget = /target="_blank"/;

module.exports = function(data, callback){
if (!config.external_link) return callback();

data.content = data.content.replace(rTag, function(match, attr, title){

if (rTarget.test(attr)) return match;

var href = attr.match(rHref);


if (!href) return match;

