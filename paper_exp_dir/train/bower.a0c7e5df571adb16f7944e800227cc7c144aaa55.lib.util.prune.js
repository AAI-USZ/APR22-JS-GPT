







var semver   = require('semver');
var sort     = require('stable');
var template = require('./template');
var config   = require('../core/config');

var versionRequirements = function (dependencyMap) {
var result = {};

for (var name in dependencyMap) {
dependencyMap[name].forEach(function (pkg) {
