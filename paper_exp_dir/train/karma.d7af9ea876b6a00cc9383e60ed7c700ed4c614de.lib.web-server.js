var fs = require('fs'),
http = require('http'),
util = require('util');

var SCRIPT_TAG = '<script type="text/javascript" src="%s"></script>';
var MIME_TYPE = {
txt: 'text/plain',
html: 'text/html',
js: 'application/javascript'
};

var createHandler = function(fileGuardian, STATIC_FOLDER) {
return function(request, response) {


var serveStaticFile = function(file, process) {
fs.readFile(file, function(error, data) {

if (error) {
response.writeHead(404);
return response.end('NOT FOUND');
}


response.setHeader('Content-Type', MIME_TYPE[file.split('.').pop()] || MIME_TYPE.txt);


var responseData = process && process(data.toString(), response) || data;
response.writeHead(200);

return response.end(responseData);
});
};


if (request.url === '/') {
return serveStaticFile(STATIC_FOLDER + 'client.html');
}


if (request.url === '/context.html') {
return serveStaticFile(STATIC_FOLDER + 'context.html', function(data, response) {

response.setHeader('Cache-Control', 'no-cache');


var scriptTags = [];
fileGuardian.getFiles().forEach(function(file) {
scriptTags.push(util.format(SCRIPT_TAG, file.path + '?' + file.mtime.getTime()));
});

return data.replace('%SCRIPTS%', scriptTags.join('\n'));
});
}


return serveStaticFile(request.url.replace(/\?.*/, ''), function(data, response) {

response.setHeader('Cache-Control', ['public', 'max-age=31536000']);
});
};
};

exports.createWebServer = function(fileGuardian, staticFolder) {
return http.createServer(createHandler(fileGuardian, staticFolder));
};
