var mout = require('mout');
var fs = require('graceful-fs');
var path = require('path');
var Q = require('q');
var Logger = require('bower-logger');
var endpointParser = require('bower-endpoint-parser');
var Project = require('../core/Project');
var defaultConfig = require('../config');
var GitHubResolver = require('../core/resolvers/GitHubResolver');
var GitFsResolver = require('../core/resolvers/GitFsResolver');
var cli = require('../util/cli');
var cmd = require('../util/cmd');
var createError = require('../util/createError');

function init(config) {
var project;
var logger = new Logger();

config = mout.object.deepFillIn(config || {}, defaultConfig);


if (!config.interactive) {
process.nextTick(function () {
logger.emit('error', createError('Register requires an interactive shell', 'ENOINT', {
details: 'Note that you can manually force an interactive shell with --config.interactive'
}));
});
return logger;
}

project = new Project(config, logger);


readJson(project, logger)

.then(setDefaults.bind(null, config))

.then(promptUser.bind(null, logger))

.spread(setIgnore)

.spread(setDependencies.bind(null, project))

.spread(saveJson.bind(null, project, logger))
.done(function (json) {
logger.emit('end', json);
}, function (error) {
logger.emit('error', error);
});

return logger;
}

function readJson(project, logger) {
return project.hasJson()
