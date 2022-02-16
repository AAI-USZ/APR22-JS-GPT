

var querystring = require('querystring');
var common = require('./common');
var pause = require('connect').utils.pause;


var findByPath = function(files, path) {
for (var i = 0; i < files.length; i++) {
if (files[i].path === path) {
return files[i];
}
}

return null;
};


var createSourceFilesMiddleware = function(filesPromise, serveFile,
basePath) {

return function(request, response, next) {
var requestedFilePath = querystring.unescape(request.url)
.replace(/\?.*$/, '')
.replace(/^\/absolute/, '')
.replace(/^\/base/, basePath);




var pausedRequest = pause(request);

return filesPromise.then(function(files) {

var file = findByPath(files.served, requestedFilePath);

if (file) {
serveFile(file.contentPath || file.path, response, function() {
if (/\?\w+/.test(request.url)) {

common.setHeavyCacheHeaders(response);
} else {

common.setNoCacheHeaders(response);
}
}, file.content);
} else {
next();
}

pausedRequest.resume();
});
};
};



exports.create = createSourceFilesMiddleware;
