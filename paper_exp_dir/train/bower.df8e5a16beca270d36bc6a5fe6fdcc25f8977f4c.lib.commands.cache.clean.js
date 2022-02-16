var fs = require('../../util/fs');
var path = require('path');
var mout = require('mout');
var Q = require('q');
var rimraf = require('../../util/rimraf');
var endpointParser = require('bower-endpoint-parser');
var PackageRepository = require('../../core/PackageRepository');
var semver = require('../../util/semver');
var defaultConfig = require('../../config');

function clean(logger, endpoints, options, config) {
var decEndpoints;
var names;

options = options || {};
config = defaultConfig(config);


if (endpoints && !endpoints.length) {
endpoints = null;
}


if (endpoints) {
decEndpoints = endpoints.map(function (endpoint) {
return endpointParser.decompose(endpoint);
});
names = decEndpoints.map(function (decEndpoint) {
return decEndpoint.name || decEndpoint.source;
});
}

return Q.all([
clearPackages(decEndpoints, config, logger),
clearLinks(names, config, logger)
])
.spread(function (entries) {
return entries;
});
}

function clearPackages(decEndpoints, config, logger) {
var repository =  new PackageRepository(config, logger);

return repository.list()
.then(function (entries) {
var promises;


if (decEndpoints) {
entries = entries.filter(function (entry) {
return !!mout.array.find(decEndpoints, function (decEndpoint) {
var entryPkgMeta = entry.pkgMeta;


if  (decEndpoint.name !== entryPkgMeta.name &&
decEndpoint.source !== entryPkgMeta.name &&
decEndpoint.source !== entryPkgMeta._source
) {
return false;
}


if (decEndpoint.target === '*') {
return true;
}


if (semver.validRange(decEndpoint.target)) {
return semver.satisfies(entryPkgMeta.version, decEndpoint.target);
}


return decEndpoint.target === entryPkgMeta._target ||
decEndpoint.target === entryPkgMeta._release;
});
});
}

promises = entries.map(function (entry) {
return repository.eliminate(entry.pkgMeta)
.then(function () {
logger.info('deleted', 'Cached package ' + entry.pkgMeta.name + ': ' + entry.canonicalDir, {
file: entry.canonicalDir
});
});
});

return Q.all(promises)
.then(function () {
if (!decEndpoints) {


return repository.clear();
}
})
.then(function () {
return entries;
});
});
}

function clearLinks(names, config, logger) {
var promise;
var dir = config.storage.links;


if (!names) {
promise = Q.nfcall(fs.readdir, dir)
.fail(function (err) {
if (err.code === 'ENOENT') {
return [];
}

throw err;
});

} else {
promise = Q.resolve(names);
}

return promise
.then(function (names) {
var promises;
var linksToRemove = [];


promises = names.map(function (name) {
var link = path.join(config.storage.links, name);

return Q.nfcall(fs.readlink, link)
.then(function (linkTarget) {


return Q.nfcall(fs.stat, linkTarget)
.then(function (stat) {

if (!stat.isDirectory()) {
linksToRemove.push(link);
}
})

.fail(function () {
linksToRemove.push(link);
});

}, function (err) {
if (err.code !== 'ENOENT') {
linksToRemove.push(link);
}
});
});

return Q.all(promises)
.then(function () {
var promises;


promises = linksToRemove.map(function (link) {
return Q.nfcall(rimraf, link)
.then(function () {
logger.info('deleted', 'Invalid link: ' + link, {
file: link
});
});
});

return Q.all(promises);
});
});
}



clean.readOptions = function (argv) {
var cli = require('../../util/cli');
var options = cli.readOptions(argv);
var endpoints = options.argv.remain.slice(2);

delete options.argv;

return [endpoints, options];
};

module.exports = clean;
