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
config = mout.object.deepFillIn(config || {}, defaultConfig);
project = new Project(config, logger);

project.getTree()
.spread(function (tree, flattened) {
var baseDir;


if (options.relative) {
baseDir = path.dirname(path.join(config.cwd, config.directory));

project.walkTree(tree, function (node) {
node.canonicalDir = path.relative(baseDir, node.canonicalDir);
}, true);

