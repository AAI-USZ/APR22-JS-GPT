var Q = require('q');
var fs = require('fs');
var path = require('path');
var mout = require('mout');
var resolvers = require('./resolvers');
var createError = require('../util/createError');

function createResolver(decEndpoint, config, logger, registryClient) {
var resolvedPath;
var source = decEndpoint.source;
var resolverDecEndpoint = mout.object.pick(decEndpoint, ['name', 'source', 'target']);



if (/^git(\+(ssh|https?))?:\/\
resolverDecEndpoint.source = source.replace(/^git\+/, '');
return Q.fcall(function () {
return new resolvers.GitRemote(resolverDecEndpoint, config, logger);
});
}


if (/^https?:\/\
return Q.fcall(function () {
return new resolvers.Url(resolverDecEndpoint, config, logger);
});
}


resolvedPath = path.resolve(config.cwd, source);






return Q.nfcall(fs.stat, path.join(resolvedPath, '.git'))
.then(function (stats) {
if (stats.isDirectory()) {
resolverDecEndpoint.source = resolvedPath;
return function () {
return Q.resolve(new resolvers.GitFs(resolverDecEndpoint, config, logger));
};
}

throw new Error('Not a Git repository');
})

.fail(function () {
return Q.nfcall(fs.stat, resolvedPath)
.then(function () {
resolverDecEndpoint.source = resolvedPath;
return function () {
return Q.resolve(new resolvers.Fs(resolverDecEndpoint, config, logger));
};
});
})

.fail(function (err) {
var parts = source.split('/');

if (parts.length === 2) {
resolverDecEndpoint.source = mout.string.interpolate(config.shorthandResolver, {
shorthand: source,
owner: parts[0],
package: parts[1]
});

return function () {
return Q.resolve(new resolvers.GitRemote(resolverDecEndpoint, config, logger));
};
}

throw err;
})

.fail(function (err) {
if (!registryClient) {
throw err;
}

return function () {
return Q.nfcall(registryClient.lookup.bind(registryClient), source)
.then(function (entry) {
if (!entry) {
throw createError('Package ' + source + ' not found', 'ENOTFOUND');
}



decEndpoint.registry = true;
resolverDecEndpoint.source = entry.url;

return new resolvers.GitRemote(resolverDecEndpoint, config, logger);
});
