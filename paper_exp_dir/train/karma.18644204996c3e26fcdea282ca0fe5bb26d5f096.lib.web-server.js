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

var createHandler = function(fileGuardian, STATIC_FOLDER) {
return function(request, response) {


var serveStaticFile = function(file, process) {
file = path.normalize(file);

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




if (request.url === '/') {
return serveStaticFile(STATIC_FOLDER + '/client.html');
}


if (request.url === '/testacular.js') {
return serveStaticFile(STATIC_FOLDER + '/testacular.js');
}



if (request.url === '/context.html' || request.url === '/debug.html') {
return serveStaticFile(STATIC_FOLDER + request.url, function(data, response) {

response.setHeader('Cache-Control', 'no-cache');

var scriptTags = fileGuardian.getFiles().map(function(file) {

return util.format(SCRIPT_TAG, request.url === '/context.html' ?
file.path + '?' + file.mtime.getTime() : file.path);
});

return data.replace('%SCRIPTS%', scriptTags.join('\n'));
});
}


return serveStaticFile(request.url.replace(/\?.*/, ''), function(data, response) {
if (/\?\d+/.test(request.url)) {

response.setHeader('Cache-Control', ['public', 'max-age=31536000']);
} else {

response.setHeader('Cache-Control', 'no-cache');
}
});
};
};

exports.createWebServer = function(fileGuardian, staticFolder) {
return http.createServer(createHandler(fileGuardian, staticFolder));
};
