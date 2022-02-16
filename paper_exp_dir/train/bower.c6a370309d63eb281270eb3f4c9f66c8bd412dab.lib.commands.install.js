var mout = require('mout');
var Logger = require('bower-logger');
var endpointParser = require('bower-endpoint-parser');
var Project = require('../core/Project');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function install(endpoints, options, config) {
var project;
var decEndpoints;
var logger = new Logger();

