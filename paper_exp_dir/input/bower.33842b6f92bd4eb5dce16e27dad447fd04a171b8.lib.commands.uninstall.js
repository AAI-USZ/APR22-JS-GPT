var mout = require('mout');
var Q = require('q');
var Project = require('../core/Project');
var cli = require('../util/cli');
var Tracker = require('../util/analytics').Tracker;
var defaultConfig = require('../config');

function uninstall(logger, names, options, config) {
var project;
var tracker;

options = options || {};
config = defaultConfig(config);
project = new Project(config, logger);
tracker = new Tracker(config);

tracker.trackNames('uninstall', names);

return project.getTree(options)
.spread(function (tree, flattened) {

return project.uninstall(names, options)

.then(function (uninstalled) {
var names = Object.keys(uninstalled);
var children = [];


mout.object.forOwn(flattened, function (node) {
if (names.indexOf(node.endpoint.name) !== -1) {
children.push.apply(children, mout.object.keys(node.dependencies));
}
});


return clean(project, children, uninstalled);
});
});
}

function clean(project, names, removed) {
removed = removed || {};

return project.getTree()
.spread(function (tree, flattened) {
var nodes = [];
var dependantsCounter = {};


mout.object.forOwn(flattened, function (node) {
if (names.indexOf(node.endpoint.name) !== -1) {
nodes.push(node);
}
});


project.walkTree(tree, function (node, nodeName) {
if (names.indexOf(nodeName) !== -1) {
dependantsCounter[nodeName] = dependantsCounter[nodeName] || 0;
dependantsCounter[nodeName] += node.nrDependants;
}
}, true);



nodes = nodes.filter(function (node) {
return !dependantsCounter[node.endpoint.name];
});


if (!nodes.length) {
return Q.resolve(removed);
}


names = nodes.map(function (node) {
return node.endpoint.name;
});


return project.uninstall(names)

.then(function (uninstalled) {
var children;

mout.object.mixIn(removed, uninstalled);


children = [];
nodes.forEach(function (node) {
children.push.apply(children, mout.object.keys(node.dependencies));
});


return clean(project, children, removed);
});
});
}



uninstall.line = function (logger, argv) {
var options = uninstall.options(argv);
var names = options.argv.remain.slice(1);

if (!names.length) {
return new Q();
} else {
return uninstall(logger, names, options);
}
};

uninstall.options = function (argv) {
return cli.readOptions({
'save': { type: Boolean, shorthand: 'S' },
'save-dev': { type: Boolean, shorthand: 'D' }
}, argv);
};

