var url = require('url');

var rTag = /<a(.+?)>(.+?)<\/a>/g,
rHref = /href="(.*?)"/,
rTarget = /target="_blank"/;

module.exports = function(data, callback){
var config = hexo.config;

if (!config.external_link) return callback();
