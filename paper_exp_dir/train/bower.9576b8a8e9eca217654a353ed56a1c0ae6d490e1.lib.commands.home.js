var mout = require('mout');
var Logger = require('bower-logger');
var Project = require('../core/Project');
var open = require('open');
var endpointParser = require('bower-endpoint-parser');
var cli = require('../util/cli');
var createError = require('../util/createError');
var defaultConfig = require('../config');

function home(name, config) {
var project;
var promise;
var decEndpoint;
var logger = new Logger();
