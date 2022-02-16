var fs = require('fs'),
http = require('http'),
util = require('util'),
path = require('path'),
log = require('./logger').create('web server');

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



var createHandler = function(fileGuardian, staticFolder, adapterFolder, baseFolder) {
staticFolder = path.normalize(staticFolder);
adapterFolder = path.normalize(adapterFolder);
baseFolder = path.normalize(baseFolder);

return function(request, response) {


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

if (process.platform === 'win32') {
requestedFilePath = requestedFilePath.replace(/\
}


if (request.url === '/testacular.js') {
return serveStaticFile(staticFolder + '/testacular.js');
}



if (request.url === '/context.html' || request.url === '/debug.html') {
return serveStaticFile(staticFolder + request.url, function(data, response) {

setNoCacheHeaders(response);

var scriptTags = fileGuardian.getFiles().map(function(file) {
var filePath = file.path;

if (filePath.indexOf(adapterFolder) === 0) {
filePath = '/adapter' + filePath.substr(adapterFolder.length);
} else if (filePath.indexOf(baseFolder) === 0) {
filePath = '/base' + filePath.substr(baseFolder.length);
} else {
filePath = '/absolute' + filePath;
}

if (process.platform === 'win32' && !file.isUrl) {
filePath = filePath.replace(/\\/g, '/');
}


return util.format(SCRIPT_TAG, request.url === '/context.html' && !file.isUrl ?
filePath + '?' + file.mtime.getTime() : filePath);
});

return data.replace('%SCRIPTS%', scriptTags.join('\n'));
});
}

var equalsPath = function(file) {
return file.path === requestedFilePath;
};


if (!fileGuardian.getFiles().some(equalsPath)) {
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

exports.createWebServer = function(fileGuardian, staticFolder, adapterFolder, baseFolder) {
return http.createServer(createHandler(fileGuardian, staticFolder, adapterFolder, baseFolder));
};
