var url = require('url');

var log = require('./logger').create('proxy');


var parseProxyConfig = function(proxies) {
var proxyConfig = {};
var endsWithSlash = function(str) {
return str.substr(-1) === '/';
};
