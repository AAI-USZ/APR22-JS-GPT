var url = require('url'),
log = require('./logger').create('proxy');

var parseProxyConfig = function(proxies) {
var proxyConfig = {};
var endsWithSlash = function(str) {
return str.substr(-1) === '/';
};

if (!proxies) {
return proxyConfig;
}

Object.keys(proxies).forEach(function(proxyPath) {
var proxyUrl = proxies[proxyPath];
var proxyDetails = url.parse(proxyUrl);
var pathname = proxyDetails.pathname;



if (endsWithSlash(proxyPath) && !endsWithSlash(proxyUrl)) {
log.warn('proxy "%s" normalized to "%s"', proxyUrl, proxyUrl + '/');
proxyUrl += '/';
}
