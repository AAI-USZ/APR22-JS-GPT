







var path   = require('path');
var fs     = require('fs');
var semver = require('semver');

var config = require('../core/config');

function save(manager) {

manager.on('resolve', function (resolved) {
if (resolved) manager.on('loadJSON', function () {
manager.json.dependencies = manager.json.dependencies || {};


for (var name in manager.dependencies) {
var curr = manager.dependencies[name][0];
if (curr.root) {
addDependency(manager.json, curr);
}
}


fs.writeFileSync(path.join(manager.cwd, config.json), JSON.stringify(manager.json, null, 2));
}).loadJSON();
});
}

function addDependency(json, pkg) {
var path;
var tag;

if (pkg.lookedUp) {
tag = pkg.originalTag || '~' + pkg.version;
} else {
path = (pkg.gitUrl || pkg.assetUrl || pkg.originalPath || '');
tag = pkg.originalTag || '~' + pkg.version;
}


if (!semver.valid(tag) && !semver.validRange(tag)) tag = null;

return json.dependencies[pkg.name] = path ? path + (tag ? '#' + tag : '') : tag || 'latest';
}

module.exports = save;
