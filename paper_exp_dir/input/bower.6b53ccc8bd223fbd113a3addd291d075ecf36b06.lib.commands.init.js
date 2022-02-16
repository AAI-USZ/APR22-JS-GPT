var mout = require('mout');
var fs = require('graceful-fs');
var path = require('path');
var Q = require('q');
var endpointParser = require('bower-endpoint-parser');
var Project = require('../core/Project');
var defaultConfig = require('../config');
var GitHubResolver = require('../core/resolvers/GitHubResolver');
var GitFsResolver = require('../core/resolvers/GitFsResolver');
var cli = require('../util/cli');
var cmd = require('../util/cmd');
var createError = require('../util/createError');

function init(logger, config) {
var project;

config = defaultConfig(config);


if (!config.interactive) {
