







var semver = require('semver');
var sort   = require('stable');

var versionRequirements = function (dependencyMap) {
var result = {};

for (var name in dependencyMap) {
dependencyMap[name].forEach(function (pkg) {
result[name] = result[name] || [];
if (pkg.originalTag && result[name].indexOf(pkg.originalTag) === -1) {
result[name].push(pkg.originalTag);
}
});
}

return result;
};

var validVersions = function (versions, dependency) {
if (!versions || !versions.length) return true;


if (!dependency.version) return false;

if (!semver.valid(dependency.version)) {
throw new Error('Invalid semver version ' + dependency.version + ' specified in ' + dependency.name);
}

return versions.every(function (version) {
return semver.satisfies(dependency.version, version);
});
};

module.exports = function (dependencyMap) {







var result     = {};
var versionMap = versionRequirements(dependencyMap);

for (var name in dependencyMap) {
var matches = dependencyMap[name].filter(validVersions.bind(this, versionMap[name]));


dependencyMap[name] = sort(matches, function (a, b) {
if (semver.gt(a.version, b.version)) return -1;
if (semver.lt(a.version, b.version)) return 1;


if (a.path === a.localPath && b.path !== b.localPath) return 1;
return 0;
});

if (!dependencyMap[name].length) {
throw new Error('No resolvable dependency for: ' + name);
}

result[name] = [ dependencyMap[name][0] ];
}

return result;
};
