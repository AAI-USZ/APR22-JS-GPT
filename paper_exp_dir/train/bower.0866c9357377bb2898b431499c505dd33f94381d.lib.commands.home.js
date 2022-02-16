var mout = require('mout');
var Logger = require('bower-logger');
var Project = require('../core/Project');
var open = require('open');
var endpointParser = require('bower-endpoint-parser');
var cli = require('../util/cli');
var createError = require('../util/createError');
var defaultConfig = require('../config');

function home(name, config) {
var project;
var promise;
var decEndpoint;
var logger = new Logger();

config = mout.object.deepFillIn(config || {}, defaultConfig);
project = new Project(config, logger);




if (!name) {
promise = project.hasJson()
.then(function (json) {
if (!json) {
throw createError('You are not inside a package', 'ENOENT');
}

return project.getJson();
});
} else {
decEndpoint = endpointParser.decompose(name);
promise = project.getPackageRepository().fetch(decEndpoint)
.spread(function (canonicalDir, pkgMeta) {
return pkgMeta;
});
}


promise.then(function (pkgMeta) {
var homepage = pkgMeta.homepage;

if (!homepage) {
throw createError('No homepage set for ' + pkgMeta.name, 'ENOHOME');
}

open(homepage);
return homepage;
})
.done(function (homepage) {
logger.emit('end', homepage);
}, function (error) {
logger.emit('error', error);
});

return logger;
}


