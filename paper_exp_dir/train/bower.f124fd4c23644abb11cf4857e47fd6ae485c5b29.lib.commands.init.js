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

pair = GitHubResolver.getOrgRepoPair(json.homepage);
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

function promptUser(json) {
var deferred = Q.defer();

var questions = [
{
'name': 'name',
'message': 'name',
'default': json.name,
'type': 'input'
},
{
'name': 'version',
'message': 'version',
'default': json.version,
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
'type': 'input'
},
{
'name': 'homepage',
'message': 'homepage',
'default': json.homepage,
'type': 'input'
},
{
'name': 'dependencies',
'message': 'set currently installed components as dependencies?',
'default': !mout.object.size(json.dependencies) && !mout.object.size(json.devDependencies),
'type': 'confirm'
},
{
'name': 'ignore',
'message': 'add commonly ignored files to ignore list?',
'default': true,
'type': 'confirm'
},
{
'name': 'private',
'message': 'would you like to mark this package as private which prevents it from being accidentally published to the registry?',
'default': !!json.private,
'type': 'confirm'
}
];

inquirer.prompt(questions, function (answers) {
json.name = answers.name;
json.version = answers.version;
json.description = answers.description;
json.main = answers.main;
json.keywords = toArray(answers.keywords);
json.authors = toArray(answers.authors);
json.license = answers.license;
json.homepage = answers.homepage;
json.private = answers.private || null;

return deferred.resolve([json, answers]);
});

return deferred.promise;
}

function toArray(value, splitter) {
var arr = value.split(splitter || ',');


arr = arr.map(function (item) {
return item.trim();
});

