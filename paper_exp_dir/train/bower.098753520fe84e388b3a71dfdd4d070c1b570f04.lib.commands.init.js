var mout = require('mout');
var fs = require('graceful-fs');
var path = require('path');
var Q = require('q');
var inquirer = require('inquirer');
var Logger = require('bower-logger');
var endpointParser = require('bower-endpoint-parser');
var cli = require('../util/cli');
var cmd = require('../util/cmd');
var Project = require('../core/Project');
var defaultConfig = require('../config');
var GitHubResolver = require('../core/resolvers/GitHubResolver');
var GitFsResolver = require('../core/resolvers/GitFsResolver');

function init(config) {
var project;
var logger = new Logger();

config = mout.object.deepFillIn(config || {}, defaultConfig);
project = new Project(config, logger);


readJson(project, logger)
