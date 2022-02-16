var Q = require('q');
var fs = require('fs');
var path = require('path');
var mout = require('mout');
var resolvers = require('./resolvers');
var defaultConfig = require('../config');
var createError = require('../util/createError');

function createResolver(decEndpoint, registryClient, config) {
var resOptions;
var source = decEndpoint.source;
var resolvedPath;

config = config || defaultConfig;


resOptions = {
target: decEndpoint.target,
name: decEndpoint.name,
config: config
};



if (/^git(\+(ssh|https?))?:\/\
source = source.replace(/^git\+/, '');
return Q.fcall(function () {
return new resolvers.GitRemote(source, resOptions);
});
}


if (/^https?:\/\
return Q.fcall(function () {
return new resolvers.Url(source, resOptions);
});
}


resolvedPath = path.resolve(config.cwd, source);






return Q.nfcall(fs.stat, path.join(resolvedPath, '.git'))
.then(function (stats) {
if (stats.isDirectory()) {
return function () {
return Q.resolve(new resolvers.GitFs(resolvedPath, resOptions));
};
}

throw new Error('Not a Git repository');
})

.fail(function () {
return Q.nfcall(fs.stat, source)
.then(function () {
return function () {
return Q.resolve(new resolvers.Fs(resolvedPath, resOptions));
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
return Q.resolve(new resolvers.GitRemote(source, resOptions));
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
decEndpoint.registryName = source;


return new resolvers.GitRemote(entry.url, resOptions);
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
