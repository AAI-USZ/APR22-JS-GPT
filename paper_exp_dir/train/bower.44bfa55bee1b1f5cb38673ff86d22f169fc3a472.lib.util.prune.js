







var semver   = require('semver');
var sort     = require('stable');

var versionRequirements = function (dependencyMap) {
var result = {};

for (var name in dependencyMap) {
dependencyMap[name].forEach(function (pkg) {
result[name] = result[name] || [];
if (pkg.originalTag && result[name].indexOf(pkg.originalTag) === -1) {
result[name].push(pkg.originalTag);
}
