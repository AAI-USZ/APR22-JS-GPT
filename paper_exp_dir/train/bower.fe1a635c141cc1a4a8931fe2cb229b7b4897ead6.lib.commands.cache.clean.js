var EventEmitter = require('events').EventEmitter;
var fs = require('graceful-fs');
var mout = require('mout');
var Q = require('q');
var rimraf = require('rimraf');
var RegistryClient = require('bower-registry-client');
var PackageRepository = require('../../core/PackageRepository');
var Logger = require('../../core/Logger');
var cli = require('../../util/cli');
var defaultConfig = require('../../config');

function clean(packages, options, config) {
var emitter = new EventEmitter();
var logger = new Logger();
var names;

options = options || {};
config = mout.object.deepMixIn(config || {}, defaultConfig);


if (packages && !packages.length) {
packages = names = null;

} else {
packages = packages.map(function (pkg) {
var split = pkg.split('#');
return {
name: split[0],
version: split[1]
};
});
names = packages.map(function (pkg) {
return pkg.name;
});
}

Q.all([
clearPackages(packages, config, logger),
clearRegistry(names, config),
clearLinks(names, config),
!names ? clearCompletion(config) : null
])
.spread(function (entries) {
emitter.emit('end', entries);
}, function (error) {
emitter.emit('error', error);
});

return logger.pipe(emitter);
}

function clearPackages(packages, config, logger) {
var repository =  new PackageRepository(config, logger);

return repository.list()
.then(function (entries) {
var promises;


if (packages) {
entries = entries.filter(function (pkgMeta) {
return !!mout.array.find(packages, function (pkg) {

if  (pkg.name !== pkgMeta.name) {
return false;
}


if (pkg.version) {
return pkg.version === pkgMeta.version ||
pkg.version === pkgMeta.target;
}

return true;
});
});
}

promises = entries.map(function (entry) {
return repository.eliminate(entry.pkgMeta);
});

return Q.all(promises)
.then(function () {
if (!packages) {


return repository.clear();
}
})
.then(function () {
return entries;
});
});
}

function clearRegistry(names, config, logger) {
var registryClient = new RegistryClient(config);
var promises;

if (names) {
promises = names.map(function (name) {
return Q.nfcall(registryClient.clearCache.bind(registryClient), name)
.then(function () {
logger.info('info', 'Cleaned registry cache for ' + name);
});
});

return Q.all(promises);
}

return Q.nfcall(registryClient.clearCache.bind(registryClient));
}

function clearLinks(names, config, logger) {

return Q.resolve();
}

function clearCompletion(config, logger) {
var dir = config.storage.completion;

return Q.nfcall(fs.stat, dir)
.then(function () {
return Q.nfcall(rimraf, dir)
.then(function () {
logger.info('deleted', 'Cleaned completion cache', {
file: dir
});
});
}, function (error) {
if (error.code !== 'ENOENT') {
throw error;
}
});
}



clean.line = function (argv) {
var options = clean.options(argv);
return clean(options.argv.remain.slice(2), options);
};

clean.options = function (argv) {
return cli.readOptions(argv);
};

clean.completion = function () {

};

module.exports = clean;
