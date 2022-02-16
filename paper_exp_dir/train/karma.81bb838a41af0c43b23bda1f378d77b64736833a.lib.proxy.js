var url = require('url'),
log = require('./logger').create('proxy');

var parseProxyConfig = function(proxies) {
var proxyConfig = {};
var endsWith = function(str, suffix) {
return str.substr(-suffix.length) === suffix;
};

if (!proxies) {
