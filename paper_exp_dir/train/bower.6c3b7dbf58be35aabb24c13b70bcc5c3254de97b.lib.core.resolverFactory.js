
var Q = require('q');
var fs = require('../util/fs');
var path = require('path');
var mout = require('mout');
var resolvers = require('./resolvers');
var createError = require('../util/createError');

var pluginResolverFactory = require('./resolvers/pluginResolverFactory');

function createInstance(decEndpoint, options, registryClient) {
decEndpoint = mout.object.pick(decEndpoint, ['name', 'target', 'source']);

options.version = require('../../package.json').version;

return getConstructor(decEndpoint, options, registryClient)
.spread(function (ConcreteResolver, decEndpoint) {
return new ConcreteResolver(decEndpoint, options.config, options.logger);
});
}

function getConstructor(decEndpoint, options, registryClient) {
var source = decEndpoint.source;
var config = options.config;





var promise = Q.resolve();

var addResolver = function (resolverFactory) {
promise = promise.then(function (result) {
if (result === undefined) {
return resolverFactory(decEndpoint, options);
} else {
return result;
}
});
};





addResolver(function () {
var selectedResolver;
var resolverNames;

if (Array.isArray(config.resolvers)) {
resolverNames = config.resolvers;
} else if (!!config.resolvers) {
resolverNames = config.resolvers.split(',');
} else {
resolverNames = [];
}

var resolverPromises = resolverNames.map(function (resolverName) {
var resolver = resolvers[resolverName]
|| pluginResolverFactory(require(resolverName), options);

return function () {
if (selectedResolver === undefined) {
var match = resolver.match.bind(resolver);

return Q.fcall(match, source).then(function (result) {
if (result) {
return selectedResolver = resolver;
}
});
} else {
return selectedResolver;
}
};
});

return resolverPromises.reduce(Q.when, new Q(undefined)).then(function (resolver) {
if (resolver) {
return Q.fcall(resolver.locate.bind(resolver), decEndpoint.source).then(function (result) {
if (result && result !== decEndpoint.source) {
decEndpoint.source = result;
decEndpoint.registry = true;
return getConstructor(decEndpoint, options, registryClient);
} else {
return [resolver, decEndpoint];
}
});
}
});
});




addResolver(function() {
if (/^git(\+(ssh|https?))?:\/\
decEndpoint.source = source.replace(/^git\+/, '');


if (resolvers.GitHub.getOrgRepoPair(source)) {
return [resolvers.GitHub, decEndpoint];
}

return [resolvers.GitRemote, decEndpoint];
}
});


addResolver(function () {
if (/^svn(\+(ssh|https?|file))?:\/\
return [resolvers.Svn, decEndpoint];
}
});


addResolver(function () {
if (/^https?:\/\
return [resolvers.Url, decEndpoint];
}
});




addResolver(function () {
var absolutePath = path.resolve(config.cwd, source);

if (/^\.\.?[\/\\]/.test(source) || /^~\
path.normalize(source).replace(/[\/\\]+$/, '') === absolutePath
) {
return Q.nfcall(fs.stat, path.join(absolutePath, '.git'))
.then(function (stats) {
decEndpoint.source = absolutePath;

if (stats.isDirectory()) {
return Q.resolve([resolvers.GitFs, decEndpoint]);
}

throw new Error('Not a Git repository');
})

.fail(function () {
return Q.nfcall(fs.stat, path.join(absolutePath, '.svn'))
.then(function (stats) {
decEndpoint.source = absolutePath;

if (stats.isDirectory()) {
return Q.resolve([resolvers.Svn, decEndpoint]);
}

throw new Error('Not a Subversion repository');
});
})

.fail(function () {
return Q.nfcall(fs.stat, absolutePath)
.then(function () {
decEndpoint.source = absolutePath;

return Q.resolve([resolvers.Fs, decEndpoint]);
});
});
}
});


addResolver(function () {

if (/[:@]/.test(source)) {
return;
}


var parts = source.split('/');
if (parts.length === 2) {
decEndpoint.source = mout.string.interpolate(config.shorthandResolver, {
shorthand: source,
owner: parts[0],
package: parts[1]
});

return getConstructor(decEndpoint, options, registryClient);
}
});


addResolver(function () {
if (!registryClient) {
return;
}

return Q.nfcall(registryClient.lookup.bind(registryClient), source)
.then(function (entry) {
if (!entry) {
throw createError('Package ' + source + ' not found', 'ENOTFOUND');
}

decEndpoint.registry = true;

if (!decEndpoint.name) {
decEndpoint.name = decEndpoint.source;
}

decEndpoint.source = entry.url;

return getConstructor(decEndpoint, options);
});
});

addResolver(function () {
throw createError('Could not find appropriate resolver for ' + source, 'ENORESOLVER');
});

return promise;
}

function clearRuntimeCache() {
mout.object.values(resolvers).forEach(function (ConcreteResolver) {
ConcreteResolver.clearRuntimeCache();
});
}

module.exports = createInstance;
module.exports.getConstructor = getConstructor;
module.exports.clearRuntimeCache = clearRuntimeCache;
