var endpointParser = require('bower-endpoint-parser');
var Project = require('../core/Project');
var Tracker = require('../util/analytics').Tracker;
var defaultConfig = require('../config');
var hasGit = require('../util/git')();
var createError = require('../util/createError');

function install(logger, endpoints, options, config) {
if (!hasGit) {
throw createError('Git is not installed or not in the right PATH', 'ENOGIT');
}
var project;
var decEndpoints;
var tracker;
