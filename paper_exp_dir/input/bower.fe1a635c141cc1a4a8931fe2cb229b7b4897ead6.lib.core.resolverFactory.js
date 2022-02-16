var Q = require('q');
var path = require('path');
var mout = require('mout');
var resolvers = require('./resolvers');
var createError = require('../util/createError');

function getConstructor(source, config, registryClient) {
var resolvedPath;
var resolvedSource = source;



if (/^git(\+(ssh|https?))?:\/\
resolvedSource = source.replace(/^git\+/, '');
return Q.fcall(function () {
return [resolvers.GitRemote, resolvedSource];
});
}


if (/^https?:\/\
return Q.fcall(function () {
return [resolvers.Url, resolvedSource];
});
}


resolvedPath = path.resolve(config.cwd, source);






return Q.nfcall(fs.stat, path.join(resolvedPath, '.git'))
.then(function (stats) {
if (stats.isDirectory()) {
resolvedSource = resolvedPath;
return function () {
return Q.resolve([resolvers.GitFs, resolvedSource]);
};
}

throw new Error('Not a Git repository');
})

.fail(function () {
return Q.nfcall(fs.stat, resolvedPath)
.then(function () {
resolvedSource = resolvedPath;
return function () {
return Q.resolve([resolvers.Fs, resolvedSource]);
};
});
})

.fail(function (err) {
var parts = source.split('/');

if (parts.length === 2) {
resolvedSource = mout.string.interpolate(config.shorthandResolver, {
shorthand: source,
owner: parts[0],
package: parts[1]
});

return function () {
return Q.resolve([resolvers.GitRemote, resolvedSource]);
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



resolvedSource = entry.url;

return [resolvers.GitRemote, resolvedSource, true];
});
};
})

.then(function (func) {
return func();

}, function () {
throw new createError('Could not find appropriate resolver for ' + source, 'ENORESOLVER');
});
}

function createResolver(decEndpoint, config, logger, registryClient) {
return getConstructor(decEndpoint.source, config, registryClient)
.spread(function (ConcreteResolver, source, fromRegistry) {
var resolverDecEndpoint = mout.object.pick(decEndpoint, ['name', 'target']);

resolverDecEndpoint.source = source;


if (fromRegistry) {
decEndpoint.registry = true;
}

return new ConcreteResolver(resolverDecEndpoint, config, logger);
});
}

createResolver.getConstructor = getConstructor;

module.exports = createResolver;
