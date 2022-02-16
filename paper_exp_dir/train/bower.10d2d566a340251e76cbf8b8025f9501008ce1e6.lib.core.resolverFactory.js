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


if (/^svn(\+ssh)?:\/\
return Q.fcall(function () {
return [resolvers.Svn, source];
});
}


if (/^https?:\/\
return Q.fcall(function () {
return [resolvers.Url, source];
});
}




