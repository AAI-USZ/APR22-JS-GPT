var EventEmitter = require('events').EventEmitter;
var path = require('path');
var mout = require('mout');
var semver = require('semver');
var Q = require('q');
var Project = require('../core/Project');
var PackageRepository = require('../core/PackageRepository');
var Logger = require('../core/Logger');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function list(options, config) {
var project;
