var config = hexo.config;

var rTag = /<a\s*([^>]+)\s*>([^<]*)<\/a>/g,
rHref = /href="(.*)"/,
rProtocol = /^([a-z]+:)?\/{2}/,
rTarget = /target="_blank"/;

module.exports = function(data, callback){
if (!config.external_link) return callback();

