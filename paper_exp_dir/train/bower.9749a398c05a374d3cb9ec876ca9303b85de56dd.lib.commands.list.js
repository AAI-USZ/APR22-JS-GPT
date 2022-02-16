var path = require('path');
var mout = require('mout');
var Q = require('q');
var Logger = require('bower-logger');
var Project = require('../core/Project');
var semver = require('../util/semver');
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

project.getTree(options)
.spread(function (tree, flattened) {
var baseDir = path.dirname(path.join(config.cwd, config.directory));



project.walkTree(tree, function (node) {
if (node.missing) {
return;
}

if (options.relative) {
node.canonicalDir = path.relative(baseDir, node.canonicalDir);
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
node.canonicalDir = path.relative(baseDir, node.canonicalDir);
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
})
.done(function (value) {
logger.emit('end', value);
}, function (error) {
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



list.line = function (argv) {
var options = list.options(argv);
return list(options);
};

list.options = function (argv) {
return cli.readOptions({
'paths': { type: Boolean, shorthand: 'p' },
'relative': { type: Boolean, shorthand: 'r' }
}, argv);
};

list.completion = function () {

};

module.exports = list;
