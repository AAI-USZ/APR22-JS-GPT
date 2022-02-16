var http = require('http');
var u = require('./util');
var path = require('path');
var httpProxy = require('http-proxy');
var proxy = require('./proxy');
var fs = require('fs');
var log = require('./logger').create('web server');
var util = require('util');

var SCRIPT_TAG = '<script type="text/javascript" src="%s"></script>';
var MIME_TYPE = {
txt: 'text/plain',
html: 'text/html',
js: 'application/javascript'
};

var setNoCacheHeaders = function(response) {
response.setHeader('Cache-Control', 'no-cache');
response.setHeader('Pragma', 'no-cache');
response.setHeader('Expires', (new Date(0)).toString());
};


exports.createWebServer = function (fileList, baseFolder, proxies, urlRoot) {
var staticFolder = path.normalize(__dirname + '/../static');
var adapterFolder = path.normalize(__dirname + '/../adapter');

return http.createServer(createHandler(fileList, u.normalizeWinPath(staticFolder),
u.normalizeWinPath(adapterFolder), baseFolder,
new httpProxy.RoutingProxy(), proxies, urlRoot));
};

var createHandler = function(fileList, staticFolder, adapterFolder, baseFolder, proxyFn, proxies, urlRoot) {
var testacularSrcHandler = createTestacularSourceHandler(fileList, staticFolder, adapterFolder, baseFolder, urlRoot);
var proxiedPathsHandler = proxy.createProxyHandler(proxyFn, proxies);
var sourceFileHandler = createSourceFileHandler(fileList, adapterFolder, baseFolder);
return function(request, response) {
if (testacularSrcHandler(request, response)) {
return;
}
if (sourceFileHandler(request, response)) {
return;
}
if (proxiedPathsHandler(request, response)) {
return;
}
response.writeHead(404);
return response.end('NOT FOUND');
};
};

var serveStaticFile = function(file, response, process) {
