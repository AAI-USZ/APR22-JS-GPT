var EventEmitter = require('events').EventEmitter;
var mout = require('mout');
var PackageRepository = require('../core/PackageRepository');
var Logger = require('../core/Logger');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function info(pkg, property, options, config) {
var repository;
var emitter = new EventEmitter();
var logger = new Logger();

config = mout.object.deepMixIn(config || {}, defaultConfig);
repository = new PackageRepository(config, logger);

pkg = pkg.split('#');
pkg = {
name: pkg[0],
version: pkg[1]
};


if (!pkg.version) {
repository.versions(pkg.name)
.then(function (versions) {
emitter.emit('end', {
package: pkg.name,
versions: versions
});
});

} else {
repository.fetch({
source: pkg.name,
target: pkg.version
})
.spread(function (canonicalDir, pkgMeta) {
pkgMeta = mout.object.filter(pkgMeta, function (value, key) {
return key.charAt(0) !== '_';
});


if (property) {
pkgMeta = mout.object.get(pkgMeta, property);
}

emitter.emit('end', pkgMeta);
}, function (error) {
emitter.emit('error', error);
});
}

return logger.pipe(emitter);
}



info.line = function (argv) {
var options = info.options(argv);
var pkg = options.argv.remain[1];
var property = options.argv.remain[2];

if (!pkg) {
return null;
}

return info(pkg, property, options);
};

