var path = require('path');
var mout = require('mout');
var semver = require('semver');
var Q = require('q');
var Logger = require('bower-logger');
var Project = require('../core/Project');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function list(options, config) {
var project;
var logger = new Logger();

options = options || {};


if (options.paths && options.relative == null)  {
options.relative = true;
}

config = mout.object.deepFillIn(config || {}, defaultConfig);
project = new Project(config, logger);

project.getTree()
.spread(function (tree, flattened) {
var baseDir = path.dirname(path.join(config.cwd, config.directory));



project.walkTree(tree, function (node) {
if (options.relative) {
node.canonicalDir = path.relative(baseDir, node.canonicalDir);
}
node.canonicalDir = normalize(node.canonicalDir);
}, true);



mout.object.forOwn(flattened, function (node) {
if (options.relative) {
node.canonicalDir = path.relative(baseDir, node.canonicalDir);
}
node.canonicalDir = normalize(node.canonicalDir);
});


if (options.paths) {
return logger.emit('end', paths(flattened));
}


if (config.offline) {
return logger.emit('end', tree);
}


return checkVersions(project, tree, logger)
.then(function () {
logger.emit('end', tree);
});
})
.fail(function (error) {
logger.emit('error', error);
});

logger.json = !!options.paths;

return logger;
}

function checkVersions(project, tree, logger) {
var promises;
var nodes = [];
var repository = project.getPackageRepository();


project.walkTree(tree, function (node) {
nodes.push(node);
}, true);

if (nodes.length) {
logger.info('check-new', 'Checking for new versions of the project dependencies..');
}


promises = nodes.map(function (node) {
var target = node.endpoint.target;

return repository.versions(node.endpoint.source)
.then(function (versions) {
node.versions = versions;


if (versions.length && semver.validRange(target)) {
node.update = {
target: semver.maxSatisfying(versions, target),
latest: semver.maxSatisfying(versions, '*')
};
}
});
});


tree.versions = [];

return Q.all(promises);
}

function paths(flattened) {
var ret = {};

mout.object.forOwn(flattened, function (pkg, name) {
var main;

if (pkg.missing) {
return;
}

main = pkg.pkgMeta.main;


if (!main) {
ret[name] = pkg.canonicalDir;
return;
}


if (typeof main === 'string') {
main = main.split(',');
}


