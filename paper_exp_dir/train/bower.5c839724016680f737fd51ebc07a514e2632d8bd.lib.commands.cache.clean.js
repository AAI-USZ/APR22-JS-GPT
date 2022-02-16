var fs = require('graceful-fs');
var path = require('path');
var mout = require('mout');
var Q = require('q');
var rimraf = require('rimraf');
var endpointParser = require('bower-endpoint-parser');
var PackageRepository = require('../../core/PackageRepository');
var semver = require('../../util/semver');
var cli = require('../../util/cli');
var defaultConfig = require('../../config');

function clean(logger, endpoints, options, config) {
var decEndpoints;
var names;

