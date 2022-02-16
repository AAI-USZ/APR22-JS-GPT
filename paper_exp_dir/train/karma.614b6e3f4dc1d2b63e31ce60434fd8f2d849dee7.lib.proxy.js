var url = require('url');

var parseProxyConfig = function(proxies) {
var proxyConfig = {};
var endsWith = function(str, suffix) {
return str.substr(-suffix.length) === suffix;
};

if (!proxies) {
return proxyConfig;
}

Object.keys(proxies).forEach(function(proxyPath) {
var proxyUrl = proxies[proxyPath];
