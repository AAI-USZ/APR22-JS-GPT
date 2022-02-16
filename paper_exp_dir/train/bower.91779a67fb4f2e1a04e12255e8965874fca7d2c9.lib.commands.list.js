var path = require('path');
var mout = require('mout');
var semver = require('semver');
var Q = require('q');
var Logger = require('bower-logger');
var Project = require('../core/Project');
var PackageRepository = require('../core/PackageRepository');
var cli = require('../util/cli');
var defaultConfig = require('../config');

