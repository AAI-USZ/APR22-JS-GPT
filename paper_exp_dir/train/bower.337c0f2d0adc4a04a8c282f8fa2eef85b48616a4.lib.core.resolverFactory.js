var Q = require('q');
var fs = require('graceful-fs');
var path = require('path');
var mout = require('mout');
var resolvers = require('./resolvers');
var createError = require('../util/createError');

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

function getConstructor(source, config, registryClient) {
var absolutePath,
promise;




if (/^git(\+(ssh|https?))?:\/\
source = source.replace(/^git\+/, '');
return Q.fcall(function () {


if (resolvers.GitHub.getOrgRepoPair(source)) {
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







absolutePath = path.resolve(config.cwd, source);

if (/^\.\.?[\/\\]/.test(source) || /^~\
promise = Q.nfcall(fs.stat, path.join(absolutePath, '.git'))
.then(function (stats) {
if (stats.isDirectory()) {
return function () {
return Q.resolve([resolvers.GitFs, absolutePath]);
};
}

throw new Error('Not a Git repository');
})

.fail(function () {
return Q.nfcall(fs.stat, absolutePath)
.then(function () {
return function () {
return Q.resolve([resolvers.Fs, absolutePath]);
};
});
});
} else {
promise = Q.reject(new Error('Not an absolute or relative file'));
}

return promise

.fail(function (err) {
var parts;


if (/[:@]/.test(source)) {
throw err;
}


parts = source.split('/');
if (parts.length === 2) {
source = mout.string.interpolate(config.shorthandResolver, {
shorthand: source,
owner: parts[0],
package: parts[1]
});

return function () {
return getConstructor(source, config, registryClient);
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
throw createError('Could not find appropriate resolver for ' + source, 'ENORESOLVER');
});
}

function clearRuntimeCache() {
mout.object.values(resolvers).forEach(function (ConcreteResolver) {
ConcreteResolver.clearRuntimeCache();
});
}

module.exports = createInstance;
module.exports.getConstructor = getConstructor;
module.exports.clearRuntimeCache = clearRuntimeCache;
