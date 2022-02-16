var url = require('url');
var httpProxy = require('http-proxy');

var log = require('../logger').create('proxy');

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

if (!endsWithSlash(proxyPath) && endsWithSlash(proxyUrl)) {
log.warn('proxy "%s" normalized to "%s"', proxyPath, proxyPath + '/');
proxyPath += '/';
}

if (pathname === '/'  && !endsWithSlash(proxyUrl)) {
pathname = '';
}

proxyConfig[proxyPath] = {
host: proxyDetails.hostname,
port: proxyDetails.port,
baseProxyUrl: pathname,
https: proxyDetails.protocol === 'https:'
};

if (!proxyConfig[proxyPath].port) {
proxyConfig[proxyPath].port = proxyConfig[proxyPath].https ? '443' : '80';
}
});

return proxyConfig;
};



var createProxyHandler = function(proxy, proxyConfig, proxyValidateSSL, urlRoot) {
var proxies = parseProxyConfig(proxyConfig);
var proxiesList = Object.keys(proxies).sort().reverse();

if (!proxiesList.length) {
var nullProxy = function createNullProxy(request, response, next) {
return next();
};
nullProxy.upgrade = function upgradeNullProxy() {
};
return nullProxy;
}

proxy.on('proxyError', function(err, req) {
if (err.code === 'ECONNRESET' && req.socket.destroyed) {
log.debug('failed to proxy %s (browser hung up the socket)', req.url);
} else {
log.warn('failed to proxy %s (%s)', req.url, err);
}
});

var middleware = function createProxy(request, response, next) {
for (var i = 0; i < proxiesList.length; i++) {
if (request.url.indexOf(proxiesList[i]) === 0) {
var proxiedUrl = proxies[proxiesList[i]];

log.debug('proxying request - %s to %s:%s', request.url, proxiedUrl.host, proxiedUrl.port);
request.url = request.url.replace(proxiesList[i], proxiedUrl.baseProxyUrl);
proxy.proxyRequest(request, response, {
host: proxiedUrl.host,
port: proxiedUrl.port,
target: {https: proxiedUrl.https, rejectUnauthorized: proxyValidateSSL}
});
return;
}
}

return next();
};

middleware.upgrade = function upgradeProxy(request, socket, head) {

if (request.url.indexOf(urlRoot) === 0) {
log.debug('NOT upgrading proxyWebSocketRequest %s', request.url);
return;
}
for (var i = 0; i < proxiesList.length; i++) {
if (request.url.indexOf(proxiesList[i]) === 0) {
var proxiedUrl = proxies[proxiesList[i]];
log.debug('upgrade proxyWebSocketRequest %s to %s:%s',
request.url, proxiedUrl.host, proxiedUrl.port);
proxy.proxyWebSocketRequest(request, socket, head,
{host: proxiedUrl.host, port: proxiedUrl.port});
}
}
};

return middleware;
};

exports.create = function(  config,   proxies,
validateSSL) {
return createProxyHandler(new httpProxy.RoutingProxy({changeOrigin: true}),
proxies, validateSSL, config.urlRoot);
};
