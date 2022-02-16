

var path = require('path');
var util = require('util');
var url = require('url');

var urlparse = function(urlStr) {
var urlObj = url.parse(urlStr, true);
urlObj.query = urlObj.query || {};
return urlObj;
};

var common = require('./common');

var VERSION = require('../constants').VERSION;
var SCRIPT_TAG = '<script type="%s" src="%s"></script>';
var LINK_TAG_CSS = '<link type="text/css" href="%s" rel="stylesheet">';
var LINK_TAG_HTML = '<link href="%s" rel="import">';
var SCRIPT_TYPE = {
'.js': 'text/javascript',
'.dart': 'application/dart'
};

var filePathToUrlPath = function(filePath, basePath, urlRoot) {
if (filePath.indexOf(basePath) === 0) {
return urlRoot + 'base' + filePath.substr(basePath.length);
}

return urlRoot + 'absolute' + filePath;
};

var getXUACompatibleMetaElement = function(url) {
var tag = '';
var urlObj = urlparse(url);
if (urlObj.query['x-ua-compatible']) {
tag = '\n<meta http-equiv="X-UA-Compatible" content="' +
urlObj.query['x-ua-compatible'] + '"/>';
}
return tag;
};

var getXUACompatibleUrl = function(url) {
var value = '';
var urlObj = urlparse(url);
if (urlObj.query['x-ua-compatible']) {
value = '?x-ua-compatible=' + encodeURIComponent(urlObj.query['x-ua-compatible']);
}
return value;
};

var createKarmaMiddleware = function(filesPromise, serveStaticFile,
basePath,    urlRoot,   client) {

return function(request, response, next) {
var requestUrl = request.normalizedUrl.replace(/\?.*/, '');


if (requestUrl === urlRoot.substr(0, urlRoot.length - 1)) {
response.setHeader('Location', urlRoot);
response.writeHead(301);
return response.end('MOVED PERMANENTLY');
}


if (requestUrl.indexOf(urlRoot) !== 0) {
return next();
}


requestUrl = requestUrl.substr(urlRoot.length - 1);


if (requestUrl === '/') {
return serveStaticFile('/client.html', response, function(data) {
return data
.replace('\n%X_UA_COMPATIBLE%', getXUACompatibleMetaElement(request.url))
.replace('%X_UA_COMPATIBLE_URL%', getXUACompatibleUrl(request.url));
});
}


if (requestUrl === '/karma.js') {
return serveStaticFile(requestUrl, response, function(data) {
return data.replace('%KARMA_URL_ROOT%', urlRoot)
.replace('%KARMA_VERSION%', VERSION);
});
}



if (requestUrl === '/context.html' || requestUrl === '/debug.html') {
return filesPromise.then(function(files) {
serveStaticFile(requestUrl, response, function(data) {
common.setNoCacheHeaders(response);

var scriptTags = files.included.map(function(file) {
var filePath = file.path;
var fileExt = path.extname(filePath);

if (!file.isUrl) {
filePath = filePathToUrlPath(filePath, basePath, urlRoot);

if (requestUrl === '/context.html') {
filePath += '?' + file.sha;
}
}

if (fileExt === '.css') {
