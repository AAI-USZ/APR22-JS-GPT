var path = require('path');
var mout = require('mout');
var Q = require('q');
var Project = require('../core/Project');
var semver = require('../util/semver');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function list(logger, options, config) {
var project;

options = options || {};


if (options.paths && options.relative == null)  {
options.relative = true;
}

config = mout.object.deepFillIn(config || {}, defaultConfig);
project = new Project(config, logger);

return project.getTree(options)
.spread(function (tree, flattened) {


project.walkTree(tree, function (node) {
if (node.missing) {
return;
}

if (options.relative) {
