var mout = require('mout');
var Q = require('q');
var endpointParser = require('bower-endpoint-parser');
var PackageRepository = require('../core/PackageRepository');
var cli = require('../util/cli');
var Tracker = require('../util/analytics').Tracker;
var defaultConfig = require('../config');

function info(logger, endpoint, property, config) {
var repository;
var decEndpoint;
var tracker;
