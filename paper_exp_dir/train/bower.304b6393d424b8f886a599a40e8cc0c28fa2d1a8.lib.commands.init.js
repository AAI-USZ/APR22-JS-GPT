var mout = require('mout');
var fs = require('graceful-fs');
var path = require('path');
var Q = require('q');
var endpointParser = require('bower-endpoint-parser');
var Project = require('../core/Project');
var defaultConfig = require('../config');
var GitHubResolver = require('../core/resolvers/GitHubResolver');
var GitFsResolver = require('../core/resolvers/GitFsResolver');
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
details: 'Note that you can manually force an interactive shell with --config.interactive'
});
}

project = new Project(config, logger);


return readJson(project, logger)

.then(setDefaults.bind(null, config))

.then(promptUser.bind(null, logger))

.spread(setIgnore.bind(null, config))

.spread(setDependencies.bind(null, project))

.spread(saveJson.bind(null, project, logger));
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

function saveJson(project, logger, json) {

mout.object.forOwn(json, function (value, key) {
if (!validConfigValue(value)) {
delete json[key];
}
});

logger.info('json', 'Generated json', { json: json });


return Q.nfcall(logger.prompt.bind(logger), {
type: 'confirm',
message: 'Looks good?',
default: true
})
.then(function (good) {
if (!good) {
return null;
}


return project.saveJson(true);
});
}



function validConfigValue(val) {
return (
mout.lang.isObject(val)  ||
mout.lang.isArray(val)   ||
mout.lang.isString(val)  ||
mout.lang.isBoolean(val) ||
mout.lang.isNumber(val)
