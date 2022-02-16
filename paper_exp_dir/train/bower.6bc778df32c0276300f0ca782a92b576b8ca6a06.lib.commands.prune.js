var mout = require('mout');
var Project = require('../core/Project');
var defaultConfig = require('../config');

function prune(logger, options, config) {
var project;

options = options || {};
config = defaultConfig(config);
project = new Project(config, logger);

return clean(project, options);
}

function clean(project, options, removed) {
removed = removed || {};



return project
.getTree(options)
.spread(function(tree, flattened, extraneous) {
var names = extraneous.map(function(extra) {
return extra.endpoint.name;
});


return project
.uninstall(names, options)
.then(function(uninstalled) {
