

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
return function(filepath, response, transform, content) {
var responseData;

if (directory) {
filepath = directory + filepath;
}


if (content) {
response.setHeader('Content-Type', mime.lookup(filepath, 'text/plain'));
