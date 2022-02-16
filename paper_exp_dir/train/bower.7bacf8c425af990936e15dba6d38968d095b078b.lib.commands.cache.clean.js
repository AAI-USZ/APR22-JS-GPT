var fs = require('graceful-fs');
var path = require('path');
var mout = require('mout');
var Q = require('q');
var semver = require('semver');
var rimraf = require('rimraf');
var Logger = require('bower-logger');
var endpointParser = require('bower-endpoint-parser');
var PackageRepository = require('../../core/PackageRepository');
var cli = require('../../util/cli');
var defaultConfig = require('../../config');

function clean(endpoints, options, config) {
var logger = new Logger();
