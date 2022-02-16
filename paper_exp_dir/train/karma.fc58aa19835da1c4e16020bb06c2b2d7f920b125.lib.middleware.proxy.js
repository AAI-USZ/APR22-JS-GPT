var url = require('url');
var httpProxy = require('http-proxy');

var log = require('../logger').create('proxy');
var constant = require('../constants');

var parseProxyConfig = function(proxies) {
var proxyConfig = {};
var endsWithSlash = function(str) {
return str.substr(-1) === '/';
};

if (!proxies) {
return proxyConfig;
