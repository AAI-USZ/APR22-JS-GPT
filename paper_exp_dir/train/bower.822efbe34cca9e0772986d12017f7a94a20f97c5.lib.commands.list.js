







var Emitter = require('events').EventEmitter;
var semver  = require('semver');
var archy   = require('archy');
var async   = require('async');
var nopt    = require('nopt');
var path    = require('path');
var _       = require('lodash');

var template = require('../util/template');
var Manager  = require('../core/manager');
var Package  = require('../core/package');
var config   = require('../core/config');
var help     = require('./help');

var shorthand   = { 'h': ['--help'] };
var optionTypes = { help: Boolean, paths: Boolean, map: Boolean };

var getTree = function (packages, subPackages, result) {
result = result || {};

_.each(subPackages || packages, function (pkg, name) {

result[pkg.name] = {};

Object.keys(pkg.json.dependencies || {}).forEach(function (name) {
result[pkg.name][name] = {};
});

var subPackages = {};

Object.keys(pkg.json.dependencies || {}).forEach(function (name) {
subPackages[name] = packages[name] || new Package(name, null);
});

getTree(packages, subPackages, result[pkg.name]);
});

return result;
};

var generatePath = function (name, main) {
if (typeof main == 'string') {
return path.join(config.directory, name, main);
} else if (_.isArray(main)) {
main = main.map(function (main) { return generatePath(name, main); });
return main.length == 1 ? main[0] : main;
}
};

var buildSource = function (pkg, shallow) {
var result = {};

if (pkg) {
['main', 'scripts', 'styles', 'templates', 'images'].forEach(function (type) {
if (pkg.json[type]) result[type] = generatePath(pkg.name, pkg.json[type]);
});
}

if (shallow) {
result.main = result.main      ? result.main
: result.scripts   ? result.scripts
: result.styles    ? result.styles
