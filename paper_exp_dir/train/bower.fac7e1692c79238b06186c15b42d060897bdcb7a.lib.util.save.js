







var path   = require('path');
var fs     = require('fs');
var semver = require('semver');

var _      = require('lodash');

var config = require('../core/config');

function save(manager, paths, dev, cb) {

if (paths && paths.length) return savePkgs.apply(savePkgs, arguments);

manager.on('loadJSON', function (newLine) {
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


var contents = JSON.stringify(manager.json, null, 2) + (newLine ? '\n' : '');
fs.writeFile(path.join(manager.cwd, config.json), contents, cb);
}).loadJSON();
}

function savePkgs(manager, paths, dev, cb) {
manager.on('loadJSON', function (newLine) {

var names = _.compact(paths.map(function (endpoint) {
endpoint = endpoint.split('#')[0];

return _.find(Object.keys(manager.dependencies), function (key) {
var dep = manager.dependencies[key][0];
if (dep.name === endpoint) return true;
if (dep.shorthand === endpoint) return true;

var fetchedEndpoint = dep.readEndpoint();
return fetchedEndpoint && fetchedEndpoint.endpoint === endpoint;
});
}));

var key = dev ? 'devDependencies' : 'dependencies';
manager.json[key] = manager.json[key] || {};



