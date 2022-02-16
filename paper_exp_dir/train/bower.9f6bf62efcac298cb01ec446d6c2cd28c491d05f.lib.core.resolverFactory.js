var Q = require('q');
var fs = require('fs');
var path = require('path');
var mout = require('mout');
var GitFsResolver = require('./resolvers/GitFsResolver');
var GitRemoteResolver = require('./resolvers/GitRemoteResolver');
var FsResolver = require('./resolvers/FsResolver');
var UrlResolver = require('./resolvers/UrlResolver');
var defaultConfig = require('../config');
var createError = require('../util/createError');

function createResolver(decEndpoint, options) {
var resOptions;
var source = decEndpoint.source;
var resolvedPath;

options = options || {};
options.config = options.config || defaultConfig;


resOptions = {
target: decEndpoint.target,
name: decEndpoint.name,
config: options.config
};



if (/^git(\+(ssh|https?))?:\/\
source = source.replace(/^git\+/, '');
return Q.fcall(function () {
return new GitRemoteResolver(source, resOptions);
});
}


if (/^https?:\/\
return Q.fcall(function () {
return new UrlResolver(source, resOptions);
});
}


resolvedPath = path.resolve(options.config.cwd, source);






return Q.nfcall(fs.stat, path.join(resolvedPath, '.git'))
.then(function (stats) {
if (stats.isDirectory()) {
return function () {
return Q.resolve(new GitFsResolver(resolvedPath, resOptions));
};
}

throw new Error('Not a Git repository');
})

.fail(function () {
return Q.nfcall(fs.stat, source)
.then(function () {
return function () {
return Q.resolve(new FsResolver(resolvedPath, resOptions));
};
});
})

.fail(function (err) {
var parts = source.split('/');

if (parts.length === 2) {
source = mout.string.interpolate(options.config.shorthandResolver, {
shorthand: source,
owner: parts[0],
package: parts[1]
});

return function () {
return Q.resolve(new GitRemoteResolver(source, resOptions));
};
}

throw err;
})

.fail(function (err) {
var registry = options.registryClient;

if (!registry) {
throw err;
}

return function () {
return Q.nfcall(registry.lookup.bind(registry), source, options)
.then(function (entry) {
decEndpoint.registryName = source;


return new GitRemoteResolver(entry.url, resOptions);
});
};
})

.then(function (func) {
return func();

}, function () {
throw new createError('Could not find appropriate resolver for source "' + source + '"', 'ENORESOLVER');
});
}

module.exports = createResolver;
