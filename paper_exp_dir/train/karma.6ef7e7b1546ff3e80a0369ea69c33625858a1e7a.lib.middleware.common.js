

var mime = require('mime');
var log = require('../logger').create('web-server');

var PromiseContainer = function() {
var promise;

this.then = function(success, error) {
return promise.then(success, error);
};

this.set = function(newPromise) {
promise = newPromise;
};
};


var serve404 = function(response, path) {
log.warn('404: ' + path);
response.writeHead(404);
return response.end('NOT FOUND');
};


var createServeFile = function(fs, directory) {
var cache = Object.create(null);

return function(filepath, response, transform, content, doNotCache) {
var responseData;

if (directory) {
filepath = directory + filepath;
}

if (!content && cache[filepath]) {
content = cache[filepath];
}


if (content && !doNotCache) {
response.setHeader('Content-Type', mime.lookup(filepath, 'text/plain'));


responseData = transform && transform(content) || content;

response.writeHead(200);

log.debug('serving (cached): ' + filepath);
return response.end(responseData);
}

return fs.readFile(filepath, function(error, data) {
if (error) {
return serve404(response, filepath);
}

if (!doNotCache) {
cache[filepath] = data.toString();
}

response.setHeader('Content-Type', mime.lookup(filepath, 'text/plain'));


responseData = transform && transform(data.toString()) || data;

response.writeHead(200);

