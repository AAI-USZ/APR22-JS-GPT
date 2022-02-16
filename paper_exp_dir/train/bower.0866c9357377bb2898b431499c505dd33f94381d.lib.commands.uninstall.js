var mout = require('mout');
var Logger = require('bower-logger');
var Q = require('q');
var Project = require('../core/Project');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function uninstall(names, options, config) {
var project;
var logger = new Logger();

options = options || {};
config = mout.object.deepFillIn(config || {}, defaultConfig);
project = new Project(config, logger);

project.getTree()
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
})
.done(function (uninstalled) {
logger.emit('end', uninstalled);
}, function (error) {
logger.emit('error', error);
});

return logger;
}

function clean(project, names, removed) {
removed = removed || {};
