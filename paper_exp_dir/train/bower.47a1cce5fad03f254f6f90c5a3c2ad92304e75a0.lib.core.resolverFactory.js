var Q = require('q');
var fs = require('graceful-fs');
var path = require('path');
var mout = require('mout');
var url = require('url');
var resolvers = require('./resolvers');
var createError = require('../util/createError');

function getConstructor(source, config, registryClient) {
var resolvedPath;
var remote;



if (/^git(\+(ssh|https?))?:\/\
source = source.replace(/^git\+/, '');
return Q.fcall(function () {
remote = url.parse(source);


if (remote.hostname.toLowerCase() === 'github.com') {
return [resolvers.GitHub, source];
}

return [resolvers.GitRemote, source];
});
}


if (/^https?:\/\
return Q.fcall(function () {
return [resolvers.Url, source];
});
}


resolvedPath = path.resolve(config.cwd, source);






return Q.nfcall(fs.stat, path.join(resolvedPath, '.git'))
.then(function (stats) {
if (stats.isDirectory()) {
source = resolvedPath;
return function () {
return Q.resolve([resolvers.GitFs, source]);
};
}

throw new Error('Not a Git repository');
})

.fail(function () {
return Q.nfcall(fs.stat, resolvedPath)
.then(function () {
source = resolvedPath;
return function () {
return Q.resolve([resolvers.Fs, source]);
};
});
})

.fail(function (err) {
var parts = source.split('/');

if (parts.length === 2) {
source = mout.string.interpolate(config.shorthandResolver, {
shorthand: source,
owner: parts[0],
package: parts[1]
});

return function () {
return Q.resolve([resolvers.GitRemote, source]);
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



source = entry.url;

return getConstructor(source, config, registryClient)
.spread(function (ConcreteResolver, source) {
return [ConcreteResolver, source, true];
});
});
};
})

.then(function (func) {
return func();

}, function () {
throw new createError('Could not find appropriate resolver for ' + source, 'ENORESOLVER');
});
}

function createInstance(decEndpoint, config, logger, registryClient) {
return getConstructor(decEndpoint.source, config, registryClient)
.spread(function (ConcreteResolver, source, fromRegistry) {
var decEndpointCopy = mout.object.pick(decEndpoint, ['name', 'target']);

decEndpointCopy.source = source;


if (fromRegistry) {
decEndpoint.registry = true;

if (!decEndpointCopy.name) {
decEndpointCopy.name = decEndpoint.name = decEndpoint.source;
}
}

return new ConcreteResolver(decEndpointCopy, config, logger);
});
}

function clearRuntimeCache() {
mout.object.values(resolvers).forEach(function (ConcreteResolver) {
ConcreteResolver.clearRuntimeCache();
