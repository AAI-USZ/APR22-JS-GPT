var Project = require('../core/Project');
var open = require('opn');
var endpointParser = require('bower-endpoint-parser');
var cli = require('../util/cli');
var createError = require('../util/createError');
var defaultConfig = require('../config');

function home(logger, name, config) {
var project;
var promise;
