var path = require('path');
var mout = require('mout');
var Q = require('q');
var Project = require('../core/Project');
var semver = require('../util/semver');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function list(logger, options, config) {
var project;

options = options || {};


