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



return project.getTree(options)
.spread(function (tree, flattened, extraneous) {
var names = extraneous.map(function (extra) {
return extra.endpoint.name;
});


return project.uninstall(names, options)
.then(function (uninstalled) {

if (!mout.object.size(uninstalled)) {
return removed;
}


mout.object.mixIn(removed, uninstalled);
return clean(project, options, removed);
});
});
}



prune.readOptions = function (argv) {
var cli = require('../util/cli');

var options = cli.readOptions({
'production': { type: Boolean, shorthand: 'p' },
}, argv);

delete options.argv;

return [options];
};

module.exports = prune;
