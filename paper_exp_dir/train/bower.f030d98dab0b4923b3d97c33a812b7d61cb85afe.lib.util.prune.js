







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

module.exports = function (dependencyMap, forceLatest) {






var resolved   = {};
var conflicted = null;
var forceblyResolved = null;
var versionMap = versionRequirements(dependencyMap);

var sortFunc = function (a, b) {
if (semver.gt(a.version, b.version)) return -1;
if (semver.lt(a.version, b.version)) return 1;


if (a.path === a.localPath && b.path !== b.localPath) return 1;
return 0;
};




for (var name in dependencyMap) {
var matches = dependencyMap[name].filter(validVersions.bind(this, versionMap[name]));
if (!matches.length) {





if (forceLatest) {
forceblyResolved = forceblyResolved || {};
forceblyResolved[name] = sort(dependencyMap[name], sortFunc);
continue;
}

matches = dependencyMap[name].filter(function (pkg) { return !!pkg.root; });
if (matches.length) {
forceblyResolved = forceblyResolved || {};
forceblyResolved[name] = dependencyMap[name].sort(function (a, b) {
console.log(a.root, b.root, a.version, b.version);
if (a.root && b.root) return sortFunc(a, b);
if (a.root) return -1;
if (b.root) return 1;
return sortFunc(a, b);
});
console.log('resolved to', forceblyResolved[name][0]);
