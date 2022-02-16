var Q = require('q');
var fs = require('fs');
var path = require('path');
var mout = require('mout');
var GitFsResolver = require('./resolvers/GitFsResolver');
var GitRemoteResolver = require('./resolvers/GitRemoteResolver');
var FsResolver = require('./resolvers/FsResolver');
var UrlResolver = require('./resolvers/UrlResolver');
var config = require('../config');
var createError = require('../util/createError');

function createResolver(endpoint, options) {
var split = endpoint.split('#');
var source;
var target;






source = split[0];
target = split[1];


options = options || {};
options.config = options.config || config;
options.target = target;


if (/^git(\+(ssh|https?))?:\/\
source = source.replace(/^git\+/, '');
return Q.resolve(new GitRemoteResolver(source, options));
}


if (/\.git$/i.test(source)) {
return Q.resolve(new GitRemoteResolver(source, options));
}


if (/^https?:\/\
return Q.resolve(new UrlResolver(source, options));
}


return Q.nfcall(fs.stat, path.join(source, '.git'))
.then(function (stats) {
if (stats.isDirectory()) {
return new GitFsResolver(source, options);
}

throw new Error('Not a Git repository');
})

.fail(function () {
return Q.nfcall(fs.stat, source)
.then(function () {
return new FsResolver(source, options);
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

return new GitRemoteResolver(source, options);
}

throw err;
})



.fail(function () {
throw new createError('Could not find appropriate resolver for source "' + source + '"', 'ENORESOLVER');
});
}

module.exports = createResolver;
