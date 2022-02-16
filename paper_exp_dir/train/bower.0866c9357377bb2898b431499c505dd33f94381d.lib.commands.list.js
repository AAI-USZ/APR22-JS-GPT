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

project.getTree()
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

