







var path   = require('path');
var fs     = require('fs');
var semver = require('semver');

var _      = require('lodash');

var config = require('../core/config');

function save(manager, paths) {

if (paths && paths.length) return savePkgs.apply(savePkgs, arguments);


manager.on('resolve', function (resolved) {
if (resolved) {
manager.on('loadJSON', function () {
manager.json.dependencies = manager.json.dependencies || {};
manager.json.devDependencies = manager.json.devDependencies || {};


for (var name in manager.dependencies) {
var curr = manager.dependencies[name][0];
if (curr.root) {
addDependency(manager.json, curr, !!manager.json.devDependencies[name]);
}
}


if (!Object.keys(manager.json.dependencies).length) {
delete manager.json.dependencies;
}


if (!Object.keys(manager.json.devDependencies).length) {
delete manager.json.devDependencies;
}


fs.writeFileSync(path.join(manager.cwd, config.json), JSON.stringify(manager.json, null, 2));
}).loadJSON();
}
});
}

function savePkgs(manager, paths, dev) {

manager.on('resolve', function (resolved) {
if (resolved) {
manager.on('loadJSON', function () {

var names = _.compact(paths.map(function (endpoint) {
endpoint = endpoint.split('#')[0];

return _.find(Object.keys(manager.dependencies), function (key) {
var dep = manager.dependencies[key][0];
if (dep.name === endpoint) return true;

var fetchedEndpoint = dep.readEndpoint();
return fetchedEndpoint && fetchedEndpoint.endpoint === endpoint;
});
}));

var key = dev ? 'devDependencies' : 'dependencies';
manager.json[key] = manager.json[key] || {};



names.forEach(function (name) {
addDependency(manager.json, manager.dependencies[name][0], dev);
});


fs.writeFileSync(path.join(manager.cwd, config.json), JSON.stringify(manager.json, null, 2));
}).loadJSON();
}
});
}

function addDependency(json, pkg, dev) {
var path;
var tag;
var key = dev ? 'devDependencies' : 'dependencies';

if (pkg.lookedUp) {
tag = pkg.originalTag || '~' + pkg.version;
} else {
path = (pkg.gitUrl || pkg.assetUrl || pkg.originalPath || '');
tag = pkg.originalTag || '~' + pkg.version;
}


if (!semver.valid(tag) && !semver.validRange(tag)) tag = null;

return json[key][pkg.name] = path ? path + (tag ? '#' + tag : '') : tag || 'latest';
}

module.exports = save;
