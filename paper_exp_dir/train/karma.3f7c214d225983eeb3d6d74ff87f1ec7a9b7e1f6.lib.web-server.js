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
fs.readFile(file, function(error, data) {
if (error) {
log.warn('404: ' + file);
response.writeHead(404);
return response.end('NOT FOUND');
}


response.setHeader('Content-Type', MIME_TYPE[file.split('.').pop()] || MIME_TYPE.txt);


var responseData = process && process(data.toString(), response) || data;
response.writeHead(200);

log.debug('serving: ' + file);
return response.end(responseData);
});
};


var createTestacularSourceHandler = function(fileList, staticFolder, adapterFolder, baseFolder, urlRoot) {
return function(request, response) {
var requestUrl = request.url.replace(/\?.*/, '');


if (requestUrl.indexOf(urlRoot) !== 0) {
return false;
}

requestUrl = requestUrl.substring(urlRoot.length - 1);

if (requestUrl === '/') {
serveStaticFile(staticFolder + '/client.html', response);
