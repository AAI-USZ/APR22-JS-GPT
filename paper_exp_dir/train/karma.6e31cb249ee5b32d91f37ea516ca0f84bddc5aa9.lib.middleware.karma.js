

var path = require('path');
var util = require('util');

var common = require('./common');

var VERSION = require('../constants').VERSION;
var SCRIPT_TAG = '<script type="%s" src="%s"></script>';
var LINK_TAG = '<link type="text/css" href="%s" rel="stylesheet">';
var SCRIPT_TYPE = {
'.js': 'text/javascript',
'.dart': 'application/dart'
};


var filePathToUrlPath = function(filePath, basePath) {
if (filePath.indexOf(basePath) === 0) {
return '/base' + filePath.substr(basePath.length);
}

return '/absolute' + filePath;
};

var createKarmaMiddleware = function(filesPromise, serveStaticFile,
basePath,    urlRoot) {

return function(request, response, next) {
var requestUrl = request.url.replace(/\?.*/, '');


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
return serveStaticFile('/client.html', response);
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

filePath = filePathToUrlPath(filePath, basePath);

if (requestUrl === '/context.html') {
filePath += '?' + file.sha;
}
}

if (fileExt === '.css') {
return util.format(LINK_TAG, filePath);
}

return util.format(SCRIPT_TAG, SCRIPT_TYPE[fileExt] || 'text/javascript', filePath);
});


var mappings = files.served.map(function(file) {
var filePath = filePathToUrlPath(file.path, basePath);

return util.format('  \'%s\': \'%s\'', filePath, file.sha);
});

mappings = 'window.__karma__.files = {\n' + mappings.join(',\n') + '\n};\n';

return data.replace('%SCRIPTS%', scriptTags.join('\n')).replace('%MAPPINGS%', mappings);
});
});
}

return next();
};
};



exports.create = createKarmaMiddleware;
