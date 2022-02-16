var fs = require('fs');
var http = require('http');
var path = require('path');
var connect = require('connect');

var common = require('./middleware/common');
var karmaMiddleware = require('./middleware/karma');
var sourceFilesMiddleware = require('./middleware/source-files');
var proxyMiddleware = require('./middleware/proxy');


var createCustomHandler = function(customFileHandlers,   basePath) {
return function(request, response, next) {
for (var i = 0; i < customFileHandlers.length; i++) {
if (customFileHandlers[i].urlRegexp.test(request.url)) {
return customFileHandlers[i].handler(request, response, 'fake/static', 'fake/adapter',
basePath, 'fake/root');
}
}

return next();
};
};


var createWebServer = function(injector) {
var serveStaticFile = common.createServeFile(fs, path.normalize(__dirname + '/../static'));
var serveFile = common.createServeFile(fs);
var filesPromise = new common.PromiseContainer();



injector = injector.createChild([{
serveFile: ['value', serveFile],
serveStaticFile: ['value', serveStaticFile],
filesPromise: ['value', filesPromise]
}]);


var compressOptions = {
filter: function(req, res){
return (/json|text|javascript|dart/).test(res.getHeader('Content-Type'));
}
};

var handler = connect()
.use(connect.compress(compressOptions))
.use(injector.invoke(karmaMiddleware.create))
.use(injector.invoke(sourceFilesMiddleware.create))
