var path = require('path');
var mout = require('mout');
var Q = require('q');
var Project = require('../core/Project');
var semver = require('../util/semver');
var defaultConfig = require('../config');

function list(logger, options, config) {
var project;

options = options || {};


if (options.paths && options.relative == null)  {
options.relative = true;
}

config = defaultConfig(config);
project = new Project(config, logger);

return project.getTree(options)
.spread(function (tree, flattened) {


project.walkTree(tree, function (node) {
if (node.missing) {
return;
}

if (options.relative) {
node.canonicalDir = path.relative(config.cwd, node.canonicalDir);
}
if (options.paths) {
node.canonicalDir = normalize(node.canonicalDir);
}
}, true);



mout.object.forOwn(flattened, function (node) {
if (node.missing) {
return;
}

if (options.relative) {
node.canonicalDir = path.relative(config.cwd, node.canonicalDir);
}
if (options.paths) {
node.canonicalDir = normalize(node.canonicalDir);
}
});


if (options.paths) {
return paths(flattened);
}


if (config.offline) {
return tree;
}


return checkVersions(project, tree, logger)
.then(function () {
return tree;
});
});
}

function checkVersions(project, tree, logger) {
var promises;
var nodes = [];
var repository = project.getPackageRepository();


project.walkTree(tree, function (node) {
if (!node.linked) {
nodes.push(node);
}
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
main = [main];
}


main = main.map(function (part) {
return normalize(path.join(pkg.canonicalDir, part).trim());
});



ret[name] = main.length === 1 ? main[0] : main;
});

return ret;
}

function normalize(src) {
return src.replace(/\\/g, '/');
}



list.readOptions = function (argv) {
var cli = require('../util/cli');

var options = cli.readOptions({
'paths': { type: Boolean, shorthand: 'p' },
'relative': { type: Boolean, shorthand: 'r' }
}, argv);

delete options.argv;

return [options];
};
