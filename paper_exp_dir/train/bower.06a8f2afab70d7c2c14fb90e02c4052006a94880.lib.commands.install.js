var endpointParser = require('bower-endpoint-parser');
var Project = require('../core/Project');
var cli = require('../util/cli');
var Tracker = require('../util/analytics').Tracker;
var defaultConfig = require('../config');

function install(logger, endpoints, options, config) {
var project;
var decEndpoints;
var tracker;
