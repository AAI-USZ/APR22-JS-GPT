var mout = require('mout');
var fs = require('graceful-fs');
var path = require('path');
var Q = require('q');
var inquirer = require('inquirer');
var Logger = require('bower-logger');
var endpointParser = require('bower-endpoint-parser');
var cli = require('../util/cli');
var cmd = require('../util/cmd');
var Project = require('../core/Project');
var defaultConfig = require('../config');
var GitHubResolver = require('../core/resolvers/GitHubResolver');

function init(config) {
var project;
var logger = new Logger();

config = mout.object.deepFillIn(config || {}, defaultConfig);
project = new Project(config, logger);


readJson(project, logger)

.then(setDefaults.bind(null, config))

.then(promptUser)

.spread(setIgnore)

.spread(setDependencies.bind(null, project))

.spread(saveJson.bind(null, project))
.then(function (json) {
logger.emit('end', json);
})
.fail(function (error) {
logger.emit('error', error);
});

return logger;
}

function readJson(project, logger) {
return project.hasJson()
.then(function (json) {
if (json) {
logger.warn('existing', 'The existing ' + path.basename(json) + ' file will be used and filled in');
}

return project.getJson();
});
}

function saveJson(project, json) {

mout.object.forOwn(json, function (value, key) {
if (value == null || mout.lang.isEmpty(value)) {
delete json[key];
}
});


return project.saveJson(true);
}

function setDefaults(config, json) {
var name;
var promise = Q.resolve();


if (!json.name) {
json.name = path.basename(config.cwd);
}


if (!json.version) {
json.version = '0.0.0';
}
