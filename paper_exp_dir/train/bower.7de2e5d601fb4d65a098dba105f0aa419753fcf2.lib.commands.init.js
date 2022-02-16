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
);
}

function setDefaults(config, json) {
var name;
var promise = Q.resolve();


if (!json.name) {
json.name = path.basename(config.cwd);
}


if (!json.main) {

name = path.basename(json.name, '.js');

if (fs.existsSync(path.join(config.cwd, 'index.js'))) {
json.main = 'index.js';
} else if (fs.existsSync(path.join(config.cwd, name + '.js'))) {
json.main = name + '.js';
}
}


if (!json.homepage) {

promise = promise.then(function () {
return cmd('git', ['config', '--get', 'remote.origin.url'])
.spread(function (stdout) {
var pair;

stdout = stdout.trim();
if (!stdout) {
return;
}

pair = GitHubResolver.getOrgRepoPair(stdout);
if (pair) {
json.homepage = 'https://github.com/' + pair.org + '/' + pair.repo;
}
})
.fail(function () { });
});
}

if (!json.authors) {
promise = promise.then(function () {

return cmd('git', ['config', '--get', '--global', 'user.name'])
.spread(function (stdout) {
var gitEmail;
var gitName = stdout.trim();


if (!gitName) {
return;
}


return cmd('git', ['config', '--get', '--global', 'user.email'])
.spread(function (stdout) {
gitEmail = stdout.trim();
}, function () {})
.then(function () {
json.authors = gitName;
json.authors += gitEmail ? ' <' + gitEmail + '>' : '';
});
}, function () {});
});
}

return promise.then(function () {
return json;
});
}

function promptUser(logger, json) {
var questions = [
{
'name': 'name',
'message': 'name',
'default': json.name,
'type': 'input'
},
{
'name': 'description',
'message': 'description',
'default': json.description,
'type': 'input'
},
{
'name': 'main',
'message': 'main file',
'default': json.main,
'type': 'input'
},
{
'name': 'keywords',
'message': 'keywords',
'default': json.keywords ? json.keywords.toString() : null,
'type': 'input'
},
{
'name': 'authors',
'message': 'authors',
'default': json.authors ? json.authors.toString() : null,
'type': 'input'
},
{
'name': 'license',
'message': 'license',
'default': json.license || 'MIT',
