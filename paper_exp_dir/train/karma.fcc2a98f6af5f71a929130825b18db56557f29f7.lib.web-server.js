var fs = require('fs');
var http = require('http');
var path = require('path');
var connect = require('connect');

var common = require('./middleware/common');
var runnerMiddleware = require('./middleware/runner');
var karmaMiddleware = require('./middleware/karma');
var sourceFilesMiddleware = require('./middleware/source-files');
var proxyMiddleware = require('./middleware/proxy');

var log = require('./logger').create('web-server');

var createCustomHandler = function(customFileHandlers,   basePath) {
return function(request, response, next) {
for (var i = 0; i < customFileHandlers.length; i++) {
if (customFileHandlers[i].urlRegex.test(request.url)) {
return customFileHandlers[i].handler(request, response, 'fake/static', 'fake/adapter',
basePath, 'fake/root');
}
}

