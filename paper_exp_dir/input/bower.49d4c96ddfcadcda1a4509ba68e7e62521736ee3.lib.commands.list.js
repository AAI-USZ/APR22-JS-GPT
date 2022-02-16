var path = require('path');
var mout = require('mout');
var semver = require('semver');
var Q = require('q');
var Logger = require('bower-logger');
var Project = require('../core/Project');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function list(options, config) {
var project;
var logger = new Logger();

options = options || {};


if (options.paths && options.relative == null)  {
options.relative = true;
}

config = mout.object.deepFillIn(config || {}, defaultConfig);
project = new Project(config, logger);

project.getTree()
.spread(function (tree, flattened) {
var baseDir = path.dirname(path.join(config.cwd, config.directory));



project.walkTree(tree, function (node) {
}
