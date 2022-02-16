var mout = require('mout');
var fs = require('../util/fs');
var path = require('path');
var Q = require('q');
var endpointParser = require('bower-endpoint-parser');
var Project = require('../core/Project');
var defaultConfig = require('../config');
var GitHubResolver = require('../core/resolvers/GitHubResolver');
var cmd = require('../util/cmd');
var createError = require('../util/createError');

function init(logger, config) {
var project;

config = config || {};

if (!config.cwd) {
config.cwd = process.cwd();
}

config = defaultConfig(config);


if (!config.interactive) {
throw createError('Register requires an interactive shell', 'ENOINT', {
details:
'Note that you can manually force an interactive shell with --config.interactive'
});
}

project = new Project(config, logger);


return (
readJson(project, logger)

.then(setDefaults.bind(null, config))
