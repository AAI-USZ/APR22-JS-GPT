var path = require('path');
var mout = require('mout');
var Q = require('q');
var Logger = require('bower-logger');
var Project = require('../core/Project');
var semver = require('../util/semver');
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

project.getTree(options)
.spread(function (tree, flattened) {

