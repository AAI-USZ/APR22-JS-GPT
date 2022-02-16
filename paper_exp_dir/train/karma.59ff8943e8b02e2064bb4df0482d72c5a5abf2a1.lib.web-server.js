var fs = require('fs'),
http = require('http'),
util = require('util'),
u = require('./util'),
path = require('path'),
log = require('./logger').create('web server'),
url = require('url'),
httpProxy = require('http-proxy');

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



var createHandler = function(fileList, staticFolder, adapterFolder, baseFolder, proxy, proxies) {

return function(request, response) {

var files = fileList.getFiles();

var getProxiedPath = function(requestUrl) {
var proxiedUrl;
if (proxies) {
var proxiesList = Object.keys(proxies);
proxiesList.sort();
proxiesList.reverse();
for (var i = 0; i < proxiesList.length; i++) {
if (requestUrl.indexOf(proxiesList[i]) === 0) {
proxiedUrl = url.parse(proxies[proxiesList[i]]);
break;
}
}
}
return proxiedUrl;
};


var serveStaticFile = function(file, process) {
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




var requestedFilePath = request.url.replace(/\?.*/, '')
.replace(/^\/adapter/, adapterFolder)
.replace(/^\/absolute/, '')
.replace(/^\/base/, baseFolder);


if (requestedFilePath === '/') {
return serveStaticFile(staticFolder + '/client.html');
}


if (request.url === '/testacular.js') {
return serveStaticFile(staticFolder + '/testacular.js');
}



if (request.url === '/context.html' || request.url === '/debug.html') {
return serveStaticFile(staticFolder + request.url, function(data, response) {

setNoCacheHeaders(response);

var scriptTags = files.map(function(file) {
var filePath = file.path;

if (!file.isUrl) {
if (filePath.indexOf(adapterFolder) === 0) {
filePath = '/adapter' + filePath.substr(adapterFolder.length);
} else if (filePath.indexOf(baseFolder) === 0) {
filePath = '/base' + filePath.substr(baseFolder.length);
} else {
filePath = '/absolute' + filePath;
}

if (request.url === '/context.html') {
filePath += '?' + file.mtime.getTime();
}
}

return util.format(SCRIPT_TAG, filePath);
});

return data.replace('%SCRIPTS%', scriptTags.join('\n'));
});
}

var equalsPath = function(file) {
return file.path === requestedFilePath;
};


var proxiedPath = getProxiedPath(request.url);
if (proxiedPath) {
proxiedPath.port = proxiedPath.port || '80';
return proxy.proxyRequest(request, response, {host: proxiedPath.hostname, port: proxiedPath.port});
}



if (!files.some(equalsPath)) {
response.writeHead(404);
return response.end('NOT FOUND');
}


return serveStaticFile(requestedFilePath, function(data, response) {
if (/\?\d+/.test(request.url)) {

response.setHeader('Cache-Control', ['public', 'max-age=31536000']);
} else {

setNoCacheHeaders(response);
}
});
};
};

exports.createWebServer = function (fileList, baseFolder, proxies) {
var staticFolder = path.normalize(__dirname + '/../static');
var adapterFolder = path.normalize(__dirname + '/../adapter');
var proxy = new httpProxy.RoutingProxy();

return http.createServer(createHandler(fileList, u.normalizeWinPath(staticFolder),
u.normalizeWinPath(adapterFolder), baseFolder,
proxy, proxies));
};
